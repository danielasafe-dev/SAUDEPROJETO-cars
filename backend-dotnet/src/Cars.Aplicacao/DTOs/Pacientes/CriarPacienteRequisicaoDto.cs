using System.ComponentModel.DataAnnotations;

namespace Cars.Application.DTOs.Patients;

public sealed class CreatePatientRequestDto
{
    [Required]
    [MaxLength(200)]
    public string Nome { get; init; } = string.Empty;

    public int? Idade { get; init; }
}
