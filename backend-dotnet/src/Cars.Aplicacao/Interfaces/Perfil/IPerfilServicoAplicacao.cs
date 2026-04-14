using Cars.Application.DTOs.Profile;
using Cars.Application.DTOs.Users;

namespace Cars.Application.Interfaces;

public interface IProfileAppService
{
    Task<UserResponseDto> GetAsync(int actorUserId, CancellationToken cancellationToken = default);
    Task<UserResponseDto> UpdateAsync(UpdateProfileRequestDto request, int actorUserId, CancellationToken cancellationToken = default);
}
