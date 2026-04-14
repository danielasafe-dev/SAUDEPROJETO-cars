using Cars.Application.DTOs.Auth;
using Cars.Application.DTOs.Users;

namespace Cars.Application.Interfaces;

public interface IAuthAppService
{
    Task<TokenResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default);
    Task<UserResponseDto> GetCurrentUserAsync(int userId, CancellationToken cancellationToken = default);
    Task<UserResponseDto> RegisterAsync(CreateUserRequestDto request, CancellationToken cancellationToken = default);
}
