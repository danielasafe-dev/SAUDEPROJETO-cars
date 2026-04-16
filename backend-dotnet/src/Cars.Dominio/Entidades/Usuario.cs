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
    private readonly List<User> _subordinados = [];

    private User()
    {
    }

    public User(string nome, Email email, string senhaHash, UserRole role, int? chefiaId = null)
    {
        if (string.IsNullOrWhiteSpace(nome))
        {
            throw new InvalidOperationException("Nome do usuario e obrigatorio.");
        }

        Nome = nome.Trim();
        Email = email.Value;
        SenhaHash = senhaHash ?? string.Empty;
        Role = role;
        SetLinkedLeadership(chefiaId);
        Ativo = true;
        CriadoEm = DateTime.UtcNow;
    }

    public string Nome { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string SenhaHash { get; private set; } = string.Empty;
    public UserRole Role { get; private set; } = UserRole.HealthAgent;
    public int? ChefiaId { get; private set; }
    public User? Chefia { get; private set; }
    public bool Ativo { get; private set; }
    public DateTime CriadoEm { get; private set; }

    public IReadOnlyCollection<Patient> PacientesCriados => _pacientesCriados;
    public IReadOnlyCollection<Evaluation> AvaliacoesRealizadas => _avaliacoesRealizadas;
    public IReadOnlyCollection<Group> ManagedGroups => _managedGroups;
    public IReadOnlyCollection<UserGroupMembership> GroupMemberships => _groupMemberships;
    public IReadOnlyCollection<User> Subordinados => _subordinados;

    public bool HasPasswordDefined() => !string.IsNullOrWhiteSpace(SenhaHash);

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

    public void ChangeRole(UserRole role)
    {
        ValidateLinkedLeadershipRequirement(role, ChefiaId);
        Role = role;
    }

    public void SetLinkedLeadership(int? chefiaId)
    {
        ValidateLinkedLeadershipRequirement(Role, chefiaId);
        ChefiaId = chefiaId;
    }

    private static void ValidateLinkedLeadershipRequirement(UserRole role, int? chefiaId)
    {
        if (role == UserRole.Admin && chefiaId.HasValue)
        {
            throw new InvalidOperationException("Administrador nao pode ter chefia vinculada.");
        }

        if (role is not UserRole.Admin and not UserRole.Leadership && !chefiaId.HasValue)
        {
            throw new InvalidOperationException("Usuarios deste perfil precisam de chefia vinculada.");
        }
    }
}
