using System.Text.Json.Serialization;

namespace Cars.Application.DTOs.Users;

public sealed class UserResponseDto
{
    public int Id { get; init; }
    public string Nome { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public bool Ativo { get; init; }
    public bool PodeAvaliar { get; init; }
    public IReadOnlyCollection<int> GroupIds { get; init; } = [];
    public IReadOnlyCollection<string> GroupNames { get; init; } = [];

    [JsonPropertyName("criado_em")]
    public DateTime CriadoEm { get; init; }
}
