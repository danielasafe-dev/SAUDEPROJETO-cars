namespace SPI.Domain.ReadModels;

public sealed class EvaluationDetails
{
    public int Id { get; init; }
    public int PatientId { get; init; }
    public string PatientNome { get; init; } = string.Empty;
    public int AvaliadorId { get; init; }
    public string AvaliadorNome { get; init; } = string.Empty;
    public int GroupId { get; init; }
    public string GroupNome { get; init; } = string.Empty;
    public int? FormTemplateId { get; init; }
    public string? FormNome { get; init; }
    public IReadOnlyDictionary<int, int> Respostas { get; init; } = new Dictionary<int, int>();
    public decimal ScoreTotal { get; init; }
    public decimal PesoTotal { get; init; }
    public string Classificacao { get; init; } = string.Empty;
    public string? Observacoes { get; init; }
    public DateTime DataAvaliacao { get; init; }
    public EvaluationReferralDetails? Referral { get; init; }
}

public sealed class EvaluationReferralDetails
{
    public int Id { get; init; }
    public int EvaluationId { get; init; }
    public int PatientId { get; init; }
    public bool Encaminhado { get; init; }
    public string? Especialidade { get; init; }
    public decimal CustoEstimado { get; init; }
    public DateTime CriadoEm { get; init; }
}



