using Cars.Domain.Common;
using Cars.Domain.Services;

namespace Cars.Domain.Entities;

public sealed class Evaluation : Entity, IAggregateRoot
{
    private Evaluation()
    {
    }

    public Evaluation(int patientId, int avaliadorId, Dictionary<int, int> respostas)
    {
        if (patientId <= 0)
        {
            throw new InvalidOperationException("Paciente invalido.");
        }

        if (avaliadorId <= 0)
        {
            throw new InvalidOperationException("Avaliador invalido.");
        }

        PatientId = patientId;
        AvaliadorId = avaliadorId;
        Respostas = respostas ?? throw new InvalidOperationException("Respostas obrigatorias.");
        ScoreTotal = CarsClassificationService.CalculateScore(Respostas);
        Classificacao = CarsClassificationService.Classify(ScoreTotal);
        DataAvaliacao = DateTime.UtcNow;
    }

    public int PatientId { get; private set; }
    public int AvaliadorId { get; private set; }
    public Dictionary<int, int> Respostas { get; private set; } = [];
    public decimal ScoreTotal { get; private set; }
    public string Classificacao { get; private set; } = string.Empty;
    public DateTime DataAvaliacao { get; private set; }

    public Patient Patient { get; private set; } = null!;
    public User Avaliador { get; private set; } = null!;
}
