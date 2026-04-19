using SPI.Application.DTOs.Users;

namespace SPI.Application.Interfaces;

public interface IUsersAppService
{
    Task<IReadOnlyCollection<UserResponseDto>> ListAsync(int actorUserId, CancellationToken cancellationToken = default);
    Task DeactivateAsync(int userId, int actorUserId, CancellationToken cancellationToken = default);
    Task UpdateGroupsAsync(int userId, UpdateUserGroupsRequestDto request, int actorUserId, CancellationToken cancellationToken = default);
}



