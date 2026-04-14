using Cars.Application.Interfaces.Seguranca;
using Cars.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Cars.Infrastructure.Data.Security;

public sealed class PasswordHasherAdapter : IPasswordHasher
{
    private readonly PasswordHasher<User> _passwordHasher = new();

    public string Hash(string password)
    {
        var user = new User("placeholder", new("placeholder@local"), "seed", Domain.Enums.UserRole.HealthAgent);
        return _passwordHasher.HashPassword(user, password);
    }

    public bool Verify(string password, string passwordHash)
    {
        var user = new User("placeholder", new("placeholder@local"), "seed", Domain.Enums.UserRole.HealthAgent);
        var result = _passwordHasher.VerifyHashedPassword(user, passwordHash, password);
        return result is PasswordVerificationResult.Success or PasswordVerificationResult.SuccessRehashNeeded;
    }
}

