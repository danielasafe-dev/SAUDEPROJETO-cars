using Cars.Application.DTOs.Users;

namespace Cars.Application.Interfaces;

public interface IUsersAppService
{
    Task<IReadOnlyCollection<UserResponseDto>> ListAsync(int actorUserId, CancellationToken cancellationToken = default);
    Task DeactivateAsync(int userId, int actorUserId, CancellationToken cancellationToken = default);
    Task UpdateGroupsAsync(int userId, UpdateUserGroupsRequestDto request, int actorUserId, CancellationToken cancellationToken = default);
}
