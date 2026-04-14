using Cars.Application.DTOs.Users;

namespace Cars.Application.Interfaces;

public interface IUsersAppService
{
    Task<IReadOnlyCollection<UserResponseDto>> ListAsync(CancellationToken cancellationToken = default);
    Task DeactivateAsync(int userId, CancellationToken cancellationToken = default);
}
