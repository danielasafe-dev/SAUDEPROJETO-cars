using SPI.Infrastructure.Data.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SPI.Infrastructure.Data.Migrations;

[DbContext(typeof(AppDbContext))]
[Migration("20260422233500_AdicionarCamposEnderecoPaciente")]
public partial class AddPatientAddressFields : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            """
            IF COL_LENGTH(N'dbo.patients', N'cep') IS NULL
            BEGIN
                ALTER TABLE dbo.patients ADD cep NVARCHAR(8) NULL;
            END;

            IF COL_LENGTH(N'dbo.patients', N'nome_responsavel') IS NULL
            BEGIN
                ALTER TABLE dbo.patients ADD nome_responsavel NVARCHAR(200) NULL;
            END;

            IF COL_LENGTH(N'dbo.patients', N'estado') IS NULL
            BEGIN
                ALTER TABLE dbo.patients ADD estado NVARCHAR(2) NULL;
            END;

            IF COL_LENGTH(N'dbo.patients', N'cidade') IS NULL
            BEGIN
                ALTER TABLE dbo.patients ADD cidade NVARCHAR(120) NULL;
            END;

            IF COL_LENGTH(N'dbo.patients', N'bairro') IS NULL
            BEGIN
                ALTER TABLE dbo.patients ADD bairro NVARCHAR(120) NULL;
            END;

            IF COL_LENGTH(N'dbo.patients', N'rua') IS NULL
            BEGIN
                ALTER TABLE dbo.patients ADD rua NVARCHAR(200) NULL;
            END;

            IF COL_LENGTH(N'dbo.patients', N'numero') IS NULL
            BEGIN
                ALTER TABLE dbo.patients ADD numero NVARCHAR(30) NULL;
            END;

            IF COL_LENGTH(N'dbo.patients', N'complemento') IS NULL
            BEGIN
                ALTER TABLE dbo.patients ADD complemento NVARCHAR(200) NULL;
            END;
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            """
            IF COL_LENGTH(N'dbo.patients', N'complemento') IS NOT NULL
            BEGIN
                ALTER TABLE dbo.patients DROP COLUMN complemento;
            END;

            IF COL_LENGTH(N'dbo.patients', N'numero') IS NOT NULL
            BEGIN
                ALTER TABLE dbo.patients DROP COLUMN numero;
            END;

            IF COL_LENGTH(N'dbo.patients', N'rua') IS NOT NULL
            BEGIN
                ALTER TABLE dbo.patients DROP COLUMN rua;
            END;

            IF COL_LENGTH(N'dbo.patients', N'bairro') IS NOT NULL
            BEGIN
                ALTER TABLE dbo.patients DROP COLUMN bairro;
            END;

            IF COL_LENGTH(N'dbo.patients', N'cidade') IS NOT NULL
            BEGIN
                ALTER TABLE dbo.patients DROP COLUMN cidade;
            END;

            IF COL_LENGTH(N'dbo.patients', N'estado') IS NOT NULL
            BEGIN
                ALTER TABLE dbo.patients DROP COLUMN estado;
            END;

            IF COL_LENGTH(N'dbo.patients', N'nome_responsavel') IS NOT NULL
            BEGIN
                ALTER TABLE dbo.patients DROP COLUMN nome_responsavel;
            END;

            IF COL_LENGTH(N'dbo.patients', N'cep') IS NOT NULL
            BEGIN
                ALTER TABLE dbo.patients DROP COLUMN cep;
            END;
            """);
    }
}
