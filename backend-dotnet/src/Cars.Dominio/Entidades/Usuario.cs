using Cars.Domain.Common;
using Cars.Domain.Enums;
using Cars.Domain.ValueObjects;

namespace Cars.Domain.Entities;

public sealed class User : Entity, IAggregateRoot
{
    private User()
    {
    }

    public User(string nome, Email email, string senhaHash, UserRole role)
    {
        if (string.IsNullOrWhiteSpace(nome))
        {
            throw new InvalidOperationException("Nome do usuario e obrigatorio.");
        }

        if (string.IsNullOrWhiteSpace(senhaHash))
        {
            throw new InvalidOperationException("Senha hash e obrigatoria.");
        }

        Nome = nome.Trim();
        Email = email.Value;
        SenhaHash = senhaHash;
        Role = role;
        Ativo = true;
        CriadoEm = DateTime.UtcNow;
    }

    public string Nome { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string SenhaHash { get; private set; } = string.Empty;
    public UserRole Role { get; private set; } = UserRole.Avaliador;
    public bool Ativo { get; private set; }
    public DateTime CriadoEm { get; private set; }

    public IReadOnlyCollection<Patient> PacientesCriados => _pacientesCriados;
    public IReadOnlyCollection<Evaluation> AvaliacoesRealizadas => _avaliacoesRealizadas;

    private readonly List<Patient> _pacientesCriados = [];
    private readonly List<Evaluation> _avaliacoesRealizadas = [];

    public void Deactivate() => Ativo = false;
}
