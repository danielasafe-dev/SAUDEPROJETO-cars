using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SPI.Application.DTOs.Patients;

public sealed class UpdatePatientRequestDto
{
    [Required]
    [MaxLength(200)]
    public string Nome { get; init; } = string.Empty;

    [Required]
    [RegularExpression(@"^\D*(\d\D*){11}$", ErrorMessage = "Informe um CPF valido com 11 digitos.")]
    public string Cpf { get; init; } = string.Empty;

    [Required]
    [JsonPropertyName("data_nascimento")]
    public DateTime? DataNascimento { get; init; }

    [Required]
    [RegularExpression("^(masculino|feminino|outro)$", ErrorMessage = "Informe um sexo valido.")]
    public string Sexo { get; init; } = string.Empty;

    [MaxLength(30)]
    public string? Telefone { get; init; }

    [EmailAddress]
    [MaxLength(200)]
    public string? Email { get; init; }

    [MaxLength(500)]
    public string? Endereco { get; init; }

    [MaxLength(2000)]
    public string? Observacoes { get; init; }

    [MaxLength(4000)]
    public string? Documentos { get; init; }

    [MaxLength(4000)]
    public string? Historico { get; init; }

    public int? GroupId { get; init; }
}
