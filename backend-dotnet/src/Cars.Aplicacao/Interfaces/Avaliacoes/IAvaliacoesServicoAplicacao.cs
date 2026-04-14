using Cars.Application.DTOs.Evaluations;

namespace Cars.Application.Interfaces;

public interface IEvaluationsAppService
{
    Task<IReadOnlyCollection<EvaluationResponseDto>> ListAsync(int actorUserId, CancellationToken cancellationToken = default);
    Task<EvaluationResponseDto?> GetByIdAsync(int id, int actorUserId, CancellationToken cancellationToken = default);
    Task<EvaluationResponseDto> CreateAsync(CreateEvaluationRequestDto request, int actorUserId, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, int actorUserId, CancellationToken cancellationToken = default);
    Task<EvaluationStatsResponseDto> GetStatsAsync(int actorUserId, CancellationToken cancellationToken = default);
    Task<ExportFileResultDto> ExportExcelAsync(int id, int actorUserId, CancellationToken cancellationToken = default);
    Task<ExportFileResultDto> ExportPdfAsync(int id, int actorUserId, CancellationToken cancellationToken = default);
}
