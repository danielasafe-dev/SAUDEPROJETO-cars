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

    [MinLength(6)]
    public string? Password { get; init; }

    [Required]
    public string Role { get; init; } = "agente_saude";

    public int? ChefiaId { get; init; }

    public IReadOnlyCollection<int> GroupIds { get; init; } = [];
}
