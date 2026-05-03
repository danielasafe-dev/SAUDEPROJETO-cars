namespace SPI.Application.DTOs.Evaluations;

public sealed class EvaluationReferralResponseDto
{
    public int Id { get; init; }
    public int EvaluationId { get; init; }
    public int PatientId { get; init; }
    public bool Encaminhado { get; init; }
    public string? Especialidade { get; init; }
    public decimal CustoEstimado { get; init; }
    public DateTime CriadoEm { get; init; }
}

public sealed class SaveEvaluationReferralRequestDto
{
    public bool Encaminhado { get; init; }
    public string? Especialidade { get; init; }
    public decimal? CustoEstimado { get; init; }
}
