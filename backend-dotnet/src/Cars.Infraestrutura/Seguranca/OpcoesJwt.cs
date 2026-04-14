namespace Cars.Infrastructure.Data.Security;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; init; } = "Cars.Api";
    public string Audience { get; init; } = "Cars.React";
    public string SecretKey { get; init; } = "super-secret-key-change-in-production";
    public int ExpireMinutes { get; init; } = 1440;
}
