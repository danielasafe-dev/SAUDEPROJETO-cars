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
                role = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                ativo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                criado_em = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_users", x => x.id);
            });

        migrationBuilder.CreateTable(
            name: "groups",
            columns: table => new
            {
                id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                nome = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                gestor_id = table.Column<int>(type: "int", nullable: false),
                ativo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                criado_em = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_groups", x => x.id);
                table.ForeignKey(
                    name: "FK_groups_users_gestor_id",
                    column: x => x.gestor_id,
                    principalTable: "users",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateTable(
            name: "form_templates",
            columns: table => new
            {
                id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                nome = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                descricao = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                group_id = table.Column<int>(type: "int", nullable: true),
                criado_por_usuario_id = table.Column<int>(type: "int", nullable: false),
                ativo = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                criado_em = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                atualizado_em = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_form_templates", x => x.id);
                table.ForeignKey(
                    name: "FK_form_templates_groups_group_id",
                    column: x => x.group_id,
                    principalTable: "groups",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_form_templates_users_criado_por_usuario_id",
                    column: x => x.criado_por_usuario_id,
                    principalTable: "users",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Restrict);
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
                group_id = table.Column<int>(type: "int", nullable: false),
                criado_em = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_patients", x => x.id);
                table.ForeignKey(
                    name: "FK_patients_groups_group_id",
                    column: x => x.group_id,
                    principalTable: "groups",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_patients_users_avaliador_id",
                    column: x => x.avaliador_id,
                    principalTable: "users",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateTable(
            name: "user_group_memberships",
            columns: table => new
            {
                user_id = table.Column<int>(type: "int", nullable: false),
                group_id = table.Column<int>(type: "int", nullable: false),
                criado_em = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_user_group_memberships", x => new { x.user_id, x.group_id });
                table.ForeignKey(
                    name: "FK_user_group_memberships_groups_group_id",
                    column: x => x.group_id,
                    principalTable: "groups",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_user_group_memberships_users_user_id",
                    column: x => x.user_id,
                    principalTable: "users",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "form_questions",
            columns: table => new
            {
                id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                form_template_id = table.Column<int>(type: "int", nullable: false),
                texto = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                peso = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                ordem = table.Column<int>(type: "int", nullable: false),
                ativa = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_form_questions", x => x.id);
                table.ForeignKey(
                    name: "FK_form_questions_form_templates_form_template_id",
                    column: x => x.form_template_id,
                    principalTable: "form_templates",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "evaluations",
            columns: table => new
            {
                id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                patient_id = table.Column<int>(type: "int", nullable: false),
                avaliador_id = table.Column<int>(type: "int", nullable: false),
                group_id = table.Column<int>(type: "int", nullable: false),
                form_template_id = table.Column<int>(type: "int", nullable: true),
                respostas = table.Column<string>(type: "nvarchar(max)", nullable: false),
                score_total = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                peso_total = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                classificacao = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                data_avaliacao = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_evaluations", x => x.id);
                table.ForeignKey(
                    name: "FK_evaluations_form_templates_form_template_id",
                    column: x => x.form_template_id,
                    principalTable: "form_templates",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_evaluations_groups_group_id",
                    column: x => x.group_id,
                    principalTable: "groups",
                    principalColumn: "id",
                    onDelete: ReferentialAction.Restrict);
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
            name: "IX_evaluations_form_template_id",
            table: "evaluations",
            column: "form_template_id");

        migrationBuilder.CreateIndex(
            name: "IX_evaluations_group_id",
            table: "evaluations",
            column: "group_id");

        migrationBuilder.CreateIndex(
            name: "IX_evaluations_patient_id",
            table: "evaluations",
            column: "patient_id");

        migrationBuilder.CreateIndex(
            name: "IX_form_questions_form_template_id",
            table: "form_questions",
            column: "form_template_id");

        migrationBuilder.CreateIndex(
            name: "IX_form_templates_criado_por_usuario_id",
            table: "form_templates",
            column: "criado_por_usuario_id");

        migrationBuilder.CreateIndex(
            name: "IX_form_templates_group_id",
            table: "form_templates",
            column: "group_id");

        migrationBuilder.CreateIndex(
            name: "IX_groups_gestor_id",
            table: "groups",
            column: "gestor_id");

        migrationBuilder.CreateIndex(
            name: "IX_patients_avaliador_id",
            table: "patients",
            column: "avaliador_id");

        migrationBuilder.CreateIndex(
            name: "IX_patients_group_id",
            table: "patients",
            column: "group_id");

        migrationBuilder.CreateIndex(
            name: "IX_user_group_memberships_group_id",
            table: "user_group_memberships",
            column: "group_id");

        migrationBuilder.CreateIndex(
            name: "IX_users_email",
            table: "users",
            column: "email",
            unique: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "evaluations");
        migrationBuilder.DropTable(name: "form_questions");
        migrationBuilder.DropTable(name: "user_group_memberships");
        migrationBuilder.DropTable(name: "patients");
        migrationBuilder.DropTable(name: "form_templates");
        migrationBuilder.DropTable(name: "groups");
        migrationBuilder.DropTable(name: "users");
    }
}
