namespace SPI.Application.DTOs.Evaluations;

public sealed class EvaluationResponseDto
{
    public int Id { get; init; }
    public int PatientId { get; init; }
    public string PatientNome { get; init; } = string.Empty;
    public int AvaliadorId { get; init; }
    public string AvaliadorNome { get; init; } = string.Empty;
    public int GroupId { get; init; }
    public string GroupNome { get; init; } = string.Empty;
    public int? FormId { get; init; }
    public string? FormNome { get; init; }
    public IReadOnlyDictionary<int, int> Respostas { get; init; } = new Dictionary<int, int>();
    public decimal ScoreTotal { get; init; }
    public decimal PesoTotal { get; init; }
    public string Classificacao { get; init; } = string.Empty;
    public DateTime DataAvaliacao { get; init; }
}



