using SPI.Application.DTOs.Auth;
using SPI.Application.DTOs.Users;
using SPI.Application.Configuration;
using SPI.Application.Interfaces;
using SPI.Application.Interfaces.Email;
using SPI.Application.Interfaces.Seguranca;
using SPI.Application.Mappings;
using SPI.Application.Services.Access;
using SPI.Domain.Enums;
using SPI.Domain.Repositories;
using SPI.Domain.ValueObjects;
using Microsoft.Extensions.Options;

namespace SPI.Application.Services;

public sealed class AuthAppService : IAuthAppService
{
    private readonly IUserRepository _userRepository;
    private readonly IGroupRepository _groupRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IPasswordInviteTokenService _passwordInviteTokenService;
    private readonly IEmailSender _emailSender;
    private readonly PasswordInviteOptions _passwordInviteOptions;
    private readonly IUnitOfWork _unitOfWork;

    public AuthAppService(
        IUserRepository userRepository,
        IGroupRepository groupRepository,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        IPasswordInviteTokenService passwordInviteTokenService,
        IEmailSender emailSender,
        IOptions<PasswordInviteOptions> passwordInviteOptions,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _groupRepository = groupRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _passwordInviteTokenService = passwordInviteTokenService;
        _emailSender = emailSender;
        _passwordInviteOptions = passwordInviteOptions.Value;
        _unitOfWork = unitOfWork;
    }

    public async Task<TokenResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var existingUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        var user = existingUser is null
            ? null
            : await _userRepository.GetDetailedByIdAsync(existingUser.Id, cancellationToken);

        if (user is null || !user.Ativo)
        {
            throw new UnauthorizedAccessException("Credenciais invalidas.");
        }

        if (!user.HasPasswordDefined())
        {
            throw new UnauthorizedAccessException("Usuario ainda nao definiu a senha.");
        }

        if (!_passwordHasher.Verify(request.Password, user.SenhaHash))
        {
            throw new UnauthorizedAccessException("Credenciais invalidas.");
        }

        return new TokenResponseDto
        {
            AccessToken = _tokenService.Generate(user),
            User = user.ToDto()
        };
    }

    public async Task<UserResponseDto> GetCurrentUserAsync(int userId, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetDetailedByIdAsync(userId, cancellationToken)
            ?? throw new KeyNotFoundException("Usuario nao encontrado.");

        if (!user.Ativo)
        {
            throw new UnauthorizedAccessException("Usuario desativado.");
        }

        return user.ToDto();
    }

    public async Task<UserResponseDto> RegisterAsync(CreateUserRequestDto request, int actorUserId, CancellationToken cancellationToken = default)
    {
        var actor = await _userRepository.GetDetailedByIdAsync(actorUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Usuario autenticado nao encontrado.");

        if (!actor.Role.CanManageUsers())
        {
            throw new UnauthorizedAccessException("Usuario sem permissao para cadastrar usuarios.");
        }

        var accessScope = AccessScopeResolver.Resolve(actor);
        var existingUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (existingUser is not null)
        {
            throw new InvalidOperationException("Ja existe usuario com este email.");
        }

        var targetRole = UserRoleExtensions.FromApiValue(request.Role);
        if (actor.Role.HasManagerPrivileges() && targetRole == UserRole.Admin)
        {
            throw new UnauthorizedAccessException("Perfil de gestao nao pode criar administradores.");
        }

        var requestedGroupIds = request.GroupIds
            .Where(x => x > 0)
            .Distinct()
            .OrderBy(x => x)
            .ToArray();

        if (actor.Role.HasManagerPrivileges() && requestedGroupIds.Any(x => !accessScope.ManagedGroupIds.Contains(x)))
        {
            throw new UnauthorizedAccessException("Perfil de gestao so pode vincular usuarios aos grupos que gerencia.");
        }

        if (requestedGroupIds.Length > 0)
        {
            var groups = await _groupRepository.ListByIdsAsync(requestedGroupIds, cancellationToken);
            if (groups.Count != requestedGroupIds.Length)
            {
                throw new KeyNotFoundException("Um ou mais grupos informados nao existem.");
            }
        }

        var initialPassword = ResolveInitialPassword(request);
        var initialPasswordHash = string.IsNullOrWhiteSpace(initialPassword)
            ? string.Empty
            : _passwordHasher.Hash(initialPassword);

        var user = new SPI.Domain.Entities.User(
            request.Nome,
            new Email(request.Email),
            initialPasswordHash,
            targetRole);

        await _userRepository.AddAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        if (requestedGroupIds.Length > 0)
        {
            await _userRepository.ReplaceGroupMembershipsAsync(user.Id, requestedGroupIds, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        var createdUser = await _userRepository.GetDetailedByIdAsync(user.Id, cancellationToken)
            ?? throw new InvalidOperationException("Nao foi possivel carregar o usuario criado.");

        return createdUser.ToDto();
    }

    public async Task SendPasswordInviteAsync(int targetUserId, int actorUserId, CancellationToken cancellationToken = default)
    {
        var actor = await _userRepository.GetDetailedByIdAsync(actorUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Usuario autenticado nao encontrado.");

        if (!actor.Role.CanManageUsers())
        {
            throw new UnauthorizedAccessException("Usuario sem permissao para enviar convite de senha.");
        }

        var targetUser = await _userRepository.GetDetailedByIdAsync(targetUserId, cancellationToken)
            ?? throw new KeyNotFoundException("Usuario nao encontrado.");

        if (!targetUser.Ativo)
        {
            throw new InvalidOperationException("Nao e possivel enviar convite para usuario inativo.");
        }

        var token = _passwordInviteTokenService.Generate(targetUser);
        var baseUrl = _passwordInviteOptions.FrontendBaseUrl.TrimEnd('/');
        var inviteUrl = $"{baseUrl}/definir-senha?token={Uri.EscapeDataString(token)}";

        var body =
            $"Ola, {targetUser.Nome}.\n\n" +
            "Voce recebeu um convite para definir sua senha de acesso ao SPI.\n\n" +
            $"Acesse o link abaixo para criar sua senha:\n{inviteUrl}\n\n" +
            $"Esse link expira em {_passwordInviteOptions.ExpireMinutes} minuto(s).\n\n" +
            "Se voce nao esperava este convite, ignore este e-mail.";

        await _emailSender.SendAsync(
            targetUser.Email,
            "Convite para definir senha no SPI",
            body,
            cancellationToken);
    }

    public async Task SetPasswordFromInviteAsync(SetPasswordFromInviteRequestDto request, CancellationToken cancellationToken = default)
    {
        var tokenPayload = _passwordInviteTokenService.Validate(request.Token);
        var user = await _userRepository.GetByIdAsync(tokenPayload.UserId, cancellationToken)
            ?? throw new KeyNotFoundException("Usuario do convite nao encontrado.");

        if (!user.Ativo)
        {
            throw new InvalidOperationException("Nao e possivel definir senha para usuario inativo.");
        }

        if (!string.Equals(user.SenhaHash ?? string.Empty, tokenPayload.PasswordHashSnapshot, StringComparison.Ordinal))
        {
            throw new InvalidOperationException("Este convite ja foi utilizado ou ficou invalido.");
        }

        var password = request.Password.Trim();
        if (password.Length < 6)
        {
            throw new InvalidOperationException("A senha precisa ter pelo menos 6 caracteres.");
        }

        user.DefinePassword(_passwordHasher.Hash(password));
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private static string ResolveInitialPassword(CreateUserRequestDto request)
    {
        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            return request.Password.Trim();
        }

        return string.Empty;
    }
}



