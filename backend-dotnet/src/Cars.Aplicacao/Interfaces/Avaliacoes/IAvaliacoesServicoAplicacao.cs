using Cars.Application.DTOs.Evaluations;

namespace Cars.Application.Interfaces;

public interface IEvaluationsAppService
{
    Task<IReadOnlyCollection<EvaluationResponseDto>> ListAsync(CancellationToken cancellationToken = default);
    Task<EvaluationResponseDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<EvaluationResponseDto> CreateAsync(CreateEvaluationRequestDto request, int avaliadorId, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<EvaluationStatsResponseDto> GetStatsAsync(CancellationToken cancellationToken = default);
}
