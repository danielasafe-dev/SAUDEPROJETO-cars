using SPI.Application.DTOs.Dashboard;
using SPI.Application.DTOs.Groups;

namespace SPI.Application.Interfaces;

public interface IDashboardAppService
{
    Task<DashboardResponseDto> GetAsync(
        int actorUserId,
        string? risco = null,
        string? especialista = null,
        DateTime? dataInicio = null,
        DateTime? dataFim = null,
        int? grupoId = null,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<GroupResponseDto>> ListFilterGroupsAsync(
        int actorUserId,
        CancellationToken cancellationToken = default);
}
