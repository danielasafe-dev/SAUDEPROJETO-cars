using System.ComponentModel.DataAnnotations;

namespace Cars.Application.DTOs.Groups;

public sealed class CreateGroupRequestDto
{
    [Required]
    [MaxLength(200)]
    public string Nome { get; init; } = string.Empty;

    public int? GestorId { get; init; }
}
