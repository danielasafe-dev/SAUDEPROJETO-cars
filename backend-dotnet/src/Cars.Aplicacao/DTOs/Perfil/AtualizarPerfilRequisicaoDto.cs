using System.ComponentModel.DataAnnotations;

namespace Cars.Application.DTOs.Profile;

public sealed class UpdateProfileRequestDto
{
    [Required]
    [MaxLength(200)]
    public string Nome { get; init; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;
}
