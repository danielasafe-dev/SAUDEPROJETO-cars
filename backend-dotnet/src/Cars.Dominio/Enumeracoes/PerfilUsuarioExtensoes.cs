namespace Cars.Domain.Enums;

public static class UserRoleExtensions
{
    public static string ToApiValue(this UserRole role) => role switch
    {
        UserRole.Admin => "admin",
        _ => "avaliador"
    };

    public static UserRole FromApiValue(string value) => value.Trim().ToLowerInvariant() switch
    {
        "admin" => UserRole.Admin,
        "avaliador" => UserRole.Avaliador,
        _ => throw new InvalidOperationException("Perfil de usuario invalido.")
    };
}
