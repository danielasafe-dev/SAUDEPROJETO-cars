using System.Text.Json.Serialization;

namespace Cars.Application.DTOs.Patients;

public sealed class PatientResponseDto
{
    public int Id { get; init; }
    public string Nome { get; init; } = string.Empty;
    public int? Idade { get; init; }

    [JsonPropertyName("avaliador_id")]
    public int? AvaliadorId { get; init; }

    [JsonPropertyName("criado_em")]
    public DateTime CriadoEm { get; init; }
}
