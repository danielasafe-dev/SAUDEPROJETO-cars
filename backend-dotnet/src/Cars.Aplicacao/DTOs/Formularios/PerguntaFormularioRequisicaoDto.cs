using System.ComponentModel.DataAnnotations;

namespace Cars.Application.DTOs.Forms;

public sealed class FormQuestionRequestDto
{
    [Required]
    [MaxLength(1000)]
    public string Texto { get; init; } = string.Empty;

    [Range(typeof(decimal), "0.01", "999999")]
    public decimal Peso { get; init; }

    [Range(1, int.MaxValue)]
    public int Ordem { get; init; }
}
