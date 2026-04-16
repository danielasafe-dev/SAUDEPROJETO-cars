namespace Cars.Domain.Enums;

public static class UserRoleExtensions
{
    public static string ToApiValue(this UserRole role) => role switch
    {
        UserRole.Admin => "admin",
        UserRole.Analyst => "analista",
        UserRole.HealthAgent => "agente_saude",
        UserRole.Manager => "gestor",
        UserRole.Leadership => "chefia",
        _ => "agente_saude"
    };

    public static UserRole FromApiValue(string value) => value.Trim().ToLowerInvariant() switch
    {
        "admin" => UserRole.Admin,
        "analista" => UserRole.Analyst,
        "agente_saude" => UserRole.HealthAgent,
        "agente-saude" => UserRole.HealthAgent,
        "avaliador" => UserRole.HealthAgent,
        "gestor" => UserRole.Manager,
        "chefia" => UserRole.Leadership,
        _ => throw new InvalidOperationException("Perfil de usuario invalido.")
    };

    public static bool HasManagerPrivileges(this UserRole role) =>
        role is UserRole.Manager or UserRole.Leadership;

    public static bool CanEvaluate(this UserRole role) =>
        role is UserRole.Admin or UserRole.HealthAgent or UserRole.Manager or UserRole.Leadership;

    public static bool CanManageUsers(this UserRole role) =>
        role is UserRole.Admin || role.HasManagerPrivileges();

    public static bool CanManageForms(this UserRole role) =>
        role is UserRole.Admin || role.HasManagerPrivileges();

    public static bool CanManageGroups(this UserRole role) =>
        role is UserRole.Admin || role.HasManagerPrivileges();

    public static bool CanViewDashboard(this UserRole role) => true;

    public static bool CanAccessOperationalModules(this UserRole role) =>
        role is not UserRole.Analyst;
}
