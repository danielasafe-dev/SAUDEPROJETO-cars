using Cars.Domain.Common;
using Cars.Domain.Enums;
using Cars.Domain.ValueObjects;

namespace Cars.Domain.Entities;

public sealed class User : Entity, IAggregateRoot
{
    private readonly List<Patient> _pacientesCriados = [];
    private readonly List<Evaluation> _avaliacoesRealizadas = [];
    private readonly List<Group> _managedGroups = [];
    private readonly List<UserGroupMembership> _groupMemberships = [];

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
    public UserRole Role { get; private set; } = UserRole.HealthAgent;
    public bool Ativo { get; private set; }
    public DateTime CriadoEm { get; private set; }

    public IReadOnlyCollection<Patient> PacientesCriados => _pacientesCriados;
    public IReadOnlyCollection<Evaluation> AvaliacoesRealizadas => _avaliacoesRealizadas;
    public IReadOnlyCollection<Group> ManagedGroups => _managedGroups;
    public IReadOnlyCollection<UserGroupMembership> GroupMemberships => _groupMemberships;

    public void Deactivate() => Ativo = false;

    public void UpdateProfile(string nome, Email email)
    {
        if (string.IsNullOrWhiteSpace(nome))
        {
            throw new InvalidOperationException("Nome do usuario e obrigatorio.");
        }

        Nome = nome.Trim();
        Email = email.Value;
    }

    public void ChangeRole(UserRole role) => Role = role;
}
