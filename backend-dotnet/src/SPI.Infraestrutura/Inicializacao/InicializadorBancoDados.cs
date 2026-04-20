using SPI.Domain.Entities;
using SPI.Domain.Enums;
using SPI.Domain.ValueObjects;
using SPI.Infrastructure.Data.Persistence;
using SPI.Infrastructure.Data.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System.Data;

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
            await EnsureSqlitePatientColumnsAsync(context, cancellationToken);
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

    private static async Task EnsureSqlitePatientColumnsAsync(AppDbContext context, CancellationToken cancellationToken)
    {
        var existingColumns = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var connection = context.Database.GetDbConnection();
        if (connection.State != ConnectionState.Open)
        {
            await connection.OpenAsync(cancellationToken);
        }

        await using var command = connection.CreateCommand();
        command.CommandText = "PRAGMA table_info('patients');";

        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            existingColumns.Add(reader.GetString(1));
        }

        await reader.CloseAsync();

        var alterCommands = new[]
        {
            ("cpf", "ALTER TABLE patients ADD COLUMN cpf TEXT NOT NULL DEFAULT '';"),
            ("data_nascimento", "ALTER TABLE patients ADD COLUMN data_nascimento TEXT NOT NULL DEFAULT '2000-01-01';"),
            ("sexo", "ALTER TABLE patients ADD COLUMN sexo TEXT NOT NULL DEFAULT 'outro';"),
            ("telefone", "ALTER TABLE patients ADD COLUMN telefone TEXT NULL;"),
            ("email", "ALTER TABLE patients ADD COLUMN email TEXT NULL;"),
            ("endereco", "ALTER TABLE patients ADD COLUMN endereco TEXT NULL;"),
            ("observacoes", "ALTER TABLE patients ADD COLUMN observacoes TEXT NULL;"),
            ("documentos", "ALTER TABLE patients ADD COLUMN documentos TEXT NULL;"),
            ("historico", "ALTER TABLE patients ADD COLUMN historico TEXT NULL;"),
        };

        foreach (var (columnName, sql) in alterCommands)
        {
            if (existingColumns.Contains(columnName))
            {
                continue;
            }

            await context.Database.ExecuteSqlRawAsync(sql, cancellationToken);
        }
    }
}



