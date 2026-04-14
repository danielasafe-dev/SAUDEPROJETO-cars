using System.ComponentModel.DataAnnotations;

namespace Cars.Application.DTOs.Groups;

public sealed class UpdateGroupRequestDto
{
    [Required]
    [MaxLength(200)]
    public string Nome { get; init; } = string.Empty;

    [Required]
    public int GestorId { get; init; }
}
