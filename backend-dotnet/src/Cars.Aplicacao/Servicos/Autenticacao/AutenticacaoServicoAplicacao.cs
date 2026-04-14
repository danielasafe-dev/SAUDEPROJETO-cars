using Cars.Application.DTOs.Auth;
using Cars.Application.DTOs.Users;
using Cars.Application.Interfaces;
using Cars.Application.Interfaces.Seguranca;
using Cars.Application.Mappings;
using Cars.Application.Services.Access;
using Cars.Domain.Enums;
using Cars.Domain.Repositories;
using Cars.Domain.ValueObjects;

namespace Cars.Application.Services;

public sealed class AuthAppService : IAuthAppService
{
    private readonly IUserRepository _userRepository;
    private readonly IGroupRepository _groupRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;

    public AuthAppService(
        IUserRepository userRepository,
        IGroupRepository groupRepository,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _groupRepository = groupRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
    }

    public async Task<TokenResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var existingUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        var user = existingUser is null
            ? null
            : await _userRepository.GetDetailedByIdAsync(existingUser.Id, cancellationToken);

        if (user is null || !user.Ativo || !_passwordHasher.Verify(request.Password, user.SenhaHash))
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
        if (actor.Role == UserRole.Manager && targetRole == UserRole.Admin)
        {
            throw new UnauthorizedAccessException("Gestor nao pode criar administradores.");
        }

        var requestedGroupIds = request.GroupIds
            .Where(x => x > 0)
            .Distinct()
            .OrderBy(x => x)
            .ToArray();

        if (actor.Role == UserRole.Manager && requestedGroupIds.Any(x => !accessScope.ManagedGroupIds.Contains(x)))
        {
            throw new UnauthorizedAccessException("Gestor so pode vincular usuarios aos grupos que gerencia.");
        }

        if (requestedGroupIds.Length > 0)
        {
            var groups = await _groupRepository.ListByIdsAsync(requestedGroupIds, cancellationToken);
            if (groups.Count != requestedGroupIds.Length)
            {
                throw new KeyNotFoundException("Um ou mais grupos informados nao existem.");
            }
        }

        var user = new Cars.Domain.Entities.User(
            request.Nome,
            new Email(request.Email),
            _passwordHasher.Hash(request.Password),
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
}
