namespace Cars.Application.DTOs.Groups;

public sealed class GroupResponseDto
{
    public int Id { get; init; }
    public string Nome { get; init; } = string.Empty;
    public int GestorId { get; init; }
    public string GestorNome { get; init; } = string.Empty;
    public bool Ativo { get; init; }
    public int QuantidadeMembros { get; init; }
    public DateTime CriadoEm { get; init; }
}
