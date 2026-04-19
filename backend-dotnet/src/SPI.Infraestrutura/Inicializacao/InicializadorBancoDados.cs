using SPI.Domain.Entities;
using SPI.Domain.Enums;
using SPI.Domain.ValueObjects;
using SPI.Infrastructure.Data.Persistence;
using SPI.Infrastructure.Data.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace SPI.Infrastructure.Data.Seed;

public static class DatabaseInitializer
{
    public static async Task InitialiseAsync(IServiceProvider serviceProvider, CancellationToken cancellationToken = default)
    {
        using var scope = serviceProvider.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var seedOptions = scope.ServiceProvider.GetRequiredService<IOptions<SeedOptions>>().Value;
        var databaseInitializationOptions = scope.ServiceProvider.GetRequiredService<IOptions<DatabaseInitializationOptions>>().Value;
        var passwordHasher = scope.ServiceProvider.GetRequiredService<PasswordHasherAdapter>();

        if (context.Database.IsSqlite())
        {
            await context.Database.EnsureCreatedAsync(cancellationToken);
        }
        else if (databaseInitializationOptions.ApplyMigrationsOnStartup)
        {
            await context.Database.MigrateAsync(cancellationToken);
        }

        if (!seedOptions.Enabled)
        {
            return;
        }

        var adminEmail = seedOptions.AdminEmail.Trim().ToLowerInvariant();
        var admin = await context.Users.FirstOrDefaultAsync(x => x.Email == adminEmail, cancellationToken);
        if (admin is not null)
        {
            return;
        }

        context.Users.Add(new User(
            seedOptions.AdminName,
            new SPI.Domain.ValueObjects.Email(seedOptions.AdminEmail),
            passwordHasher.Hash(seedOptions.AdminPassword),
            UserRole.Admin));

        await context.SaveChangesAsync(cancellationToken);
    }
}



