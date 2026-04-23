using SPI.Infrastructure.Data.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SPI.Infrastructure.Data.Migrations;

[DbContext(typeof(AppDbContext))]
[Migration("20260423012000_RemoverCamposLegadosPaciente")]
public partial class RemovePatientLegacyFields : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            """
            IF COL_LENGTH(N'dbo.patients', N'historico') IS NOT NULL
            BEGIN
                ALTER TABLE dbo.patients DROP COLUMN historico;
            END;

            IF COL_LENGTH(N'dbo.patients', N'documentos') IS NOT NULL
            BEGIN
                ALTER TABLE dbo.patients DROP COLUMN documentos;
            END;
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            """
            IF COL_LENGTH(N'dbo.patients', N'documentos') IS NULL
            BEGIN
                ALTER TABLE dbo.patients ADD documentos NVARCHAR(4000) NULL;
            END;

            IF COL_LENGTH(N'dbo.patients', N'historico') IS NULL
            BEGIN
                ALTER TABLE dbo.patients ADD historico NVARCHAR(4000) NULL;
            END;
            """);
    }
}
