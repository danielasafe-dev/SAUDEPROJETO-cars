using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cars.Infrastructure.Data.Migrations;

public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "users",
            columns: table => new
            {
                id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                nome = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                senha_hash = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                ativo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                criado_em = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_users", x => x.id);
            });

        migrationBuilder.CreateTable(
            name: "patients",
            columns: table => new
            {
                id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                nome = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                idade = table.Column<int>(type: "int", nullable: true),
                avaliador_id = table.Column<int>(type: "int", nullable: true),
                criado_em = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_patients", x => x.id);
                table.ForeignKey(
                    name: "FK_patients_users_avaliador_id",
                    column: x => x.avaliador_id,
                    principalTable: "users",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateTable(
            name: "evaluations",
            columns: table => new
            {
                id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                patient_id = table.Column<int>(type: "int", nullable: false),
                avaliador_id = table.Column<int>(type: "int", nullable: false),
                respostas = table.Column<string>(type: "nvarchar(max)", nullable: false),
                score_total = table.Column<decimal>(type: "decimal(5,1)", precision: 5, scale: 1, nullable: false),
                classificacao = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                data_avaliacao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_evaluations", x => x.id);
                table.ForeignKey(
                    name: "FK_evaluations_patients_patient_id",
                    column: x => x.patient_id,
                    principalTable: "patients",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_evaluations_users_avaliador_id",
                    column: x => x.avaliador_id,
                    principalTable: "users",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateIndex(
            name: "IX_evaluations_avaliador_id",
            table: "evaluations",
            column: "avaliador_id");

        migrationBuilder.CreateIndex(
            name: "IX_evaluations_patient_id",
            table: "evaluations",
            column: "patient_id");

        migrationBuilder.CreateIndex(
            name: "IX_patients_avaliador_id",
            table: "patients",
            column: "avaliador_id");

        migrationBuilder.CreateIndex(
            name: "IX_users_email",
            table: "users",
            column: "email",
            unique: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "evaluations");
        migrationBuilder.DropTable(name: "patients");
        migrationBuilder.DropTable(name: "users");
    }
}
