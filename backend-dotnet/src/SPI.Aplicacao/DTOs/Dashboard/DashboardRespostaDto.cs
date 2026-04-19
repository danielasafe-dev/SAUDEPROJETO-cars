using SPI.Application.DTOs.Evaluations;

namespace SPI.Application.DTOs.Dashboard;

public sealed class DashboardResponseDto
{
    public int TotalUsuarios { get; init; }
    public int TotalPacientes { get; init; }
    public int TotalAvaliacoes { get; init; }
    public int TotalFormularios { get; init; }
    public int TotalGrupos { get; init; }
    public IReadOnlyCollection<EvaluationResponseDto> UltimasAvaliacoes { get; init; } = [];
}



