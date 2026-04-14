using Cars.Domain.Common;

namespace Cars.Domain.Entities;

public sealed class Patient : Entity, IAggregateRoot
{
    private Patient()
    {
    }

    public Patient(string nome, int? idade, int? avaliadorId)
    {
        if (string.IsNullOrWhiteSpace(nome))
        {
            throw new InvalidOperationException("Nome do paciente e obrigatorio.");
        }

        if (idade is < 0)
        {
            throw new InvalidOperationException("Idade invalida.");
        }

        Nome = nome.Trim();
        Idade = idade;
        AvaliadorId = avaliadorId;
        CriadoEm = DateTime.UtcNow;
    }

    public string Nome { get; private set; } = string.Empty;
    public int? Idade { get; private set; }
    public int? AvaliadorId { get; private set; }
    public DateTime CriadoEm { get; private set; }

    public User? Avaliador { get; private set; }

    public IReadOnlyCollection<Evaluation> Avaliacoes => _avaliacoes;
    private readonly List<Evaluation> _avaliacoes = [];
}
