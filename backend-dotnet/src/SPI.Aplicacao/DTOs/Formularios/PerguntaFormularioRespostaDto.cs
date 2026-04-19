namespace SPI.Application.DTOs.Forms;

public sealed class FormQuestionResponseDto
{
    public int Id { get; init; }
    public string Texto { get; init; } = string.Empty;
    public decimal Peso { get; init; }
    public int Ordem { get; init; }
    public bool Ativa { get; init; }
}



