using Cars.Application.Interfaces.Seguranca;
using Cars.Application.DTOs.Auth;
using Cars.Application.DTOs.Users;
using Cars.Application.Interfaces;
using Cars.Application.Mappings;
using Cars.Domain.Entities;
using Cars.Domain.Enums;
using Cars.Domain.Repositories;
using Cars.Domain.ValueObjects;

namespace Cars.Application.Services;

public sealed class AuthAppService : IAuthAppService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;

    public AuthAppService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
    }

    public async Task<TokenResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
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
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
            ?? throw new KeyNotFoundException("Usuario nao encontrado.");

        if (!user.Ativo)
        {
            throw new UnauthorizedAccessException("Usuario desativado.");
        }

        return user.ToDto();
    }

    public async Task<UserResponseDto> RegisterAsync(CreateUserRequestDto request, CancellationToken cancellationToken = default)
    {
        var existingUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (existingUser is not null)
        {
            throw new InvalidOperationException("Ja existe usuario com este email.");
        }

        var user = new User(
            request.Nome,
            new Email(request.Email),
            _passwordHasher.Hash(request.Password),
            UserRoleExtensions.FromApiValue(request.Role));

        await _userRepository.AddAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return user.ToDto();
    }
}


