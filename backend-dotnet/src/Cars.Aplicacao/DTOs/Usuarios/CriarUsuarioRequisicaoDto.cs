using System.ComponentModel.DataAnnotations;

namespace Cars.Application.DTOs.Users;

public sealed class CreateUserRequestDto
{
    [Required]
    [MaxLength(200)]
    public string Nome { get; init; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; init; } = string.Empty;

    [Required]
    public string Role { get; init; } = "avaliador";
}
