using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Cars.Application.DTOs.Evaluations;

public sealed class CreateEvaluationRequestDto
{
    [JsonPropertyName("patientId")]
    public int? PatientIdCamelCase { get; init; }

    [JsonPropertyName("patient_id")]
    public int? PatientIdSnakeCase { get; init; }

    [Required]
    public Dictionary<int, int> Respostas { get; init; } = [];

    public int ResolvePatientId()
    {
        var patientId = PatientIdSnakeCase ?? PatientIdCamelCase;
        if (patientId is null || patientId <= 0)
        {
            throw new InvalidOperationException("patient_id ou patientId precisa ser informado.");
        }

        return patientId.Value;
    }
}
