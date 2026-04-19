using SPI.Application.DTOs.Profile;
using SPI.Application.DTOs.Users;

namespace SPI.Application.Interfaces;

public interface IProfileAppService
{
    Task<UserResponseDto> GetAsync(int actorUserId, CancellationToken cancellationToken = default);
    Task<UserResponseDto> UpdateAsync(UpdateProfileRequestDto request, int actorUserId, CancellationToken cancellationToken = default);
}



