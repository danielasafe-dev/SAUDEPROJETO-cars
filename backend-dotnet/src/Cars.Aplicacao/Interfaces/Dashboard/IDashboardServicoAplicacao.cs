using Cars.Application.DTOs.Dashboard;

namespace Cars.Application.Interfaces;

public interface IDashboardAppService
{
    Task<DashboardResponseDto> GetAsync(int actorUserId, CancellationToken cancellationToken = default);
}
