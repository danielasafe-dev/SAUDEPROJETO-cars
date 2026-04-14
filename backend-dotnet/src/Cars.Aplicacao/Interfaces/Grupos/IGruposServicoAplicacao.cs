using Cars.Application.DTOs.Groups;

namespace Cars.Application.Interfaces;

public interface IGroupsAppService
{
    Task<IReadOnlyCollection<GroupResponseDto>> ListAsync(int actorUserId, CancellationToken cancellationToken = default);
    Task<GroupResponseDto> CreateAsync(CreateGroupRequestDto request, int actorUserId, CancellationToken cancellationToken = default);
    Task<GroupResponseDto> UpdateAsync(int groupId, UpdateGroupRequestDto request, int actorUserId, CancellationToken cancellationToken = default);
}
