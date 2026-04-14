using Cars.Domain.Entities;
using Cars.Domain.ReadModels;
using Cars.Domain.Repositories;
using Cars.Infrastructure.Data.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Cars.Infrastructure.Data.Repositories;

public sealed class EvaluationRepository : IEvaluationRepository
{
    private readonly AppDbContext _context;

    public EvaluationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<EvaluationDetails>> ListDetailedAsync(CancellationToken cancellationToken = default)
    {
        var evaluations = await _context.Evaluations
            .AsNoTracking()
            .Include(x => x.Patient)
            .Include(x => x.Avaliador)
            .OrderByDescending(x => x.DataAvaliacao)
            .ToListAsync(cancellationToken);

        return evaluations.Select(Map).ToList();
    }

    public async Task<EvaluationDetails?> GetDetailedByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var evaluation = await _context.Evaluations
            .AsNoTracking()
            .Include(x => x.Patient)
            .Include(x => x.Avaliador)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        return evaluation is null ? null : Map(evaluation);
    }

    public Task<Evaluation?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        _context.Evaluations.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task AddAsync(Evaluation evaluation, CancellationToken cancellationToken = default) =>
        _context.Evaluations.AddAsync(evaluation, cancellationToken).AsTask();

    public void Remove(Evaluation evaluation) => _context.Evaluations.Remove(evaluation);

    private static EvaluationDetails Map(Evaluation evaluation) => new()
    {
        Id = evaluation.Id,
        PatientId = evaluation.PatientId,
        PatientNome = evaluation.Patient.Nome,
        AvaliadorId = evaluation.AvaliadorId,
        AvaliadorNome = evaluation.Avaliador.Nome,
        Respostas = new Dictionary<int, int>(evaluation.Respostas),
        ScoreTotal = evaluation.ScoreTotal,
        Classificacao = evaluation.Classificacao,
        DataAvaliacao = evaluation.DataAvaliacao
    };
}
