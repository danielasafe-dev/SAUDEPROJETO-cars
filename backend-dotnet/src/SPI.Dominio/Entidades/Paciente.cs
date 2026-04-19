using SPI.Domain.Common;

namespace SPI.Domain.Entities;

public sealed class Patient : Entity, IAggregateRoot
{
    private Patient()
    {
    }

    public Patient(string nome, int? idade, int? avaliadorId, int groupId)
    {
        if (string.IsNullOrWhiteSpace(nome))
        {
            throw new InvalidOperationException("Nome do paciente e obrigatorio.");
        }

        if (idade is < 0)
        {
            throw new InvalidOperationException("Idade invalida.");
        }

        if (groupId <= 0)
        {
            throw new InvalidOperationException("Grupo invalido.");
        }

        Nome = nome.Trim();
        Idade = idade;
        AvaliadorId = avaliadorId;
        GroupId = groupId;
        CriadoEm = DateTime.UtcNow;
    }

    public string Nome { get; private set; } = string.Empty;
    public int? Idade { get; private set; }
    public int? AvaliadorId { get; private set; }
    public int GroupId { get; private set; }
    public DateTime CriadoEm { get; private set; }

    public User? Avaliador { get; private set; }
    public Group Group { get; private set; } = null!;

    public IReadOnlyCollection<Evaluation> Avaliacoes => _avaliacoes;
    private readonly List<Evaluation> _avaliacoes = [];
}



