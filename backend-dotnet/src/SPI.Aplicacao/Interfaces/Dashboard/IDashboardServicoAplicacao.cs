using SPI.Application.DTOs.Dashboard;

namespace SPI.Application.Interfaces;

public interface IDashboardAppService
{
    Task<DashboardResponseDto> GetAsync(int actorUserId, CancellationToken cancellationToken = default);
}



