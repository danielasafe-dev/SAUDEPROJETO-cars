using SPI.Application.DTOs.Dashboard;

namespace SPI.Application.Interfaces;

public interface IDashboardAppService
{
    Task<DashboardResponseDto> GetAsync(
        int actorUserId,
        string? risco = null,
        string? especialista = null,
        DateTime? dataInicio = null,
        DateTime? dataFim = null,
        CancellationToken cancellationToken = default);
}



