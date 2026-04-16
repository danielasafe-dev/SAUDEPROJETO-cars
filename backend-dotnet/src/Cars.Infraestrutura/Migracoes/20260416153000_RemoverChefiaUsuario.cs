using Cars.Infrastructure.Data.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cars.Infrastructure.Data.Migrations;

[DbContext(typeof(AppDbContext))]
[Migration("20260416153000_RemoverChefiaUsuario")]
public partial class RemoveLinkedLeadershipFromUser : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            """
            UPDATE dbo.users
            SET role = N'gestor'
            WHERE role = N'chefia';

            IF EXISTS (
                SELECT 1
                FROM sys.foreign_keys
                WHERE name = N'FK_users_users_chefia_id'
            )
            BEGIN
                ALTER TABLE dbo.users DROP CONSTRAINT FK_users_users_chefia_id;
            END;

            IF EXISTS (
                SELECT 1
                FROM sys.indexes
                WHERE name = N'IX_users_chefia_id'
                  AND object_id = OBJECT_ID(N'dbo.users')
            )
            BEGIN
                DROP INDEX IX_users_chefia_id ON dbo.users;
            END;

            IF COL_LENGTH(N'dbo.users', N'chefia_id') IS NOT NULL
            BEGIN
                ALTER TABLE dbo.users DROP COLUMN chefia_id;
            END;
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            """
            IF COL_LENGTH(N'dbo.users', N'chefia_id') IS NULL
            BEGIN
                ALTER TABLE dbo.users ADD chefia_id INT NULL;
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.indexes
                WHERE name = N'IX_users_chefia_id'
                  AND object_id = OBJECT_ID(N'dbo.users')
            )
            BEGIN
                CREATE INDEX IX_users_chefia_id ON dbo.users(chefia_id);
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.foreign_keys
                WHERE name = N'FK_users_users_chefia_id'
            )
            BEGIN
                ALTER TABLE dbo.users
                ADD CONSTRAINT FK_users_users_chefia_id
                FOREIGN KEY (chefia_id) REFERENCES dbo.users(id);
            END;
            """);
    }
}
