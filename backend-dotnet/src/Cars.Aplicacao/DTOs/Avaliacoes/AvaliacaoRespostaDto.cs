namespace Cars.Application.DTOs.Evaluations;

public sealed class EvaluationResponseDto
{
    public int Id { get; init; }
    public int PatientId { get; init; }
    public string PatientNome { get; init; } = string.Empty;
    public int AvaliadorId { get; init; }
    public string AvaliadorNome { get; init; } = string.Empty;
    public IReadOnlyDictionary<int, int> Respostas { get; init; } = new Dictionary<int, int>();
    public decimal ScoreTotal { get; init; }
    public string Classificacao { get; init; } = string.Empty;
    public DateTime DataAvaliacao { get; init; }
}
