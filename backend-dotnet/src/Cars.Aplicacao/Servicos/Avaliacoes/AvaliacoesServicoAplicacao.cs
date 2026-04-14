using Cars.Application.DTOs.Evaluations;
using Cars.Application.Interfaces;
using Cars.Application.Mappings;
using Cars.Domain.Entities;
using Cars.Domain.Repositories;

namespace Cars.Application.Services;

public sealed class EvaluationsAppService : IEvaluationsAppService
{
    private readonly IEvaluationRepository _evaluationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public EvaluationsAppService(IEvaluationRepository evaluationRepository, IUnitOfWork unitOfWork)
    {
        _evaluationRepository = evaluationRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyCollection<EvaluationResponseDto>> ListAsync(CancellationToken cancellationToken = default)
    {
        var evaluations = await _evaluationRepository.ListDetailedAsync(cancellationToken);
        return evaluations.Select(x => x.ToDto()).ToList();
    }

    public async Task<EvaluationResponseDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var evaluation = await _evaluationRepository.GetDetailedByIdAsync(id, cancellationToken);
        return evaluation?.ToDto();
    }

    public async Task<EvaluationResponseDto> CreateAsync(CreateEvaluationRequestDto request, int avaliadorId, CancellationToken cancellationToken = default)
    {
        var evaluation = new Evaluation(request.ResolvePatientId(), avaliadorId, request.Respostas);

        await _evaluationRepository.AddAsync(evaluation, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var created = await _evaluationRepository.GetDetailedByIdAsync(evaluation.Id, cancellationToken)
            ?? throw new InvalidOperationException("Nao foi possivel recuperar a avaliacao apos salvar.");

        return created.ToDto();
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var evaluation = await _evaluationRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException("Avaliacao nao encontrada.");

        _evaluationRepository.Remove(evaluation);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<EvaluationStatsResponseDto> GetStatsAsync(CancellationToken cancellationToken = default)
    {
        var evaluations = await _evaluationRepository.ListDetailedAsync(cancellationToken);
        var list = evaluations.OrderByDescending(x => x.DataAvaliacao).ToList();

        return new EvaluationStatsResponseDto
        {
            Total = list.Count,
            AverageScore = list.Count == 0 ? 0 : Math.Round(list.Average(x => x.ScoreTotal), 1),
            LastMonth = list.Count(x => x.DataAvaliacao >= DateTime.UtcNow.AddMonths(-1)),
            ClassificationDistribution = new ClassificationDistributionDto
            {
                SemIndicativo = list.Count(x => x.ScoreTotal <= 29.5m),
                TeaLeveModerado = list.Count(x => x.ScoreTotal > 29.5m && x.ScoreTotal < 37m),
                TeaGrave = list.Count(x => x.ScoreTotal >= 37m)
            },
            RecentEvaluations = list.Take(5).Select(x => x.ToDto()).ToList()
        };
    }
}

