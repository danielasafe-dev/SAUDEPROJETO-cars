using Cars.Infrastructure.Data.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cars.Infrastructure.Data.Migrations;

[DbContext(typeof(AppDbContext))]
[Migration("20260413233000_CriacaoInicial")]
public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            """
            IF OBJECT_ID(N'dbo.users', N'U') IS NULL
            BEGIN
                CREATE TABLE dbo.users
                (
                    id INT IDENTITY(1,1) NOT NULL,
                    nome NVARCHAR(200) NOT NULL,
                    email NVARCHAR(200) NOT NULL,
                    senha_hash NVARCHAR(256) NOT NULL,
                    role NVARCHAR(30) NOT NULL,
                    ativo BIT NOT NULL CONSTRAINT DF_users_ativo DEFAULT ((1)),
                    criado_em DATETIME2 NOT NULL CONSTRAINT DF_users_criado_em DEFAULT (GETUTCDATE()),
                    CONSTRAINT PK_users PRIMARY KEY (id)
                );
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.indexes
                WHERE name = N'IX_users_email'
                  AND object_id = OBJECT_ID(N'dbo.users')
            )
            BEGIN
                CREATE UNIQUE INDEX IX_users_email ON dbo.users(email);
            END;

            UPDATE dbo.users
            SET role = N'agente_saude'
            WHERE role = N'avaliador';

            IF OBJECT_ID(N'dbo.groups', N'U') IS NULL
            BEGIN
                CREATE TABLE dbo.groups
                (
                    id INT IDENTITY(1,1) NOT NULL,
                    nome NVARCHAR(200) NOT NULL,
                    gestor_id INT NOT NULL,
                    ativo BIT NOT NULL CONSTRAINT DF_groups_ativo DEFAULT ((1)),
                    criado_em DATETIME2 NOT NULL CONSTRAINT DF_groups_criado_em DEFAULT (GETUTCDATE()),
                    CONSTRAINT PK_groups PRIMARY KEY (id)
                );
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.indexes
                WHERE name = N'IX_groups_gestor_id'
                  AND object_id = OBJECT_ID(N'dbo.groups')
            )
            BEGIN
                CREATE INDEX IX_groups_gestor_id ON dbo.groups(gestor_id);
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.foreign_keys
                WHERE name = N'FK_groups_users_gestor_id'
            )
            AND COL_LENGTH(N'dbo.groups', N'gestor_id') IS NOT NULL
            BEGIN
                ALTER TABLE dbo.groups
                ADD CONSTRAINT FK_groups_users_gestor_id
                FOREIGN KEY (gestor_id) REFERENCES dbo.users(id);
            END;

            DECLARE @adminId INT = (
                SELECT TOP (1) id
                FROM dbo.users
                WHERE email = N'admin@cars.com'
                ORDER BY id
            );

            IF @adminId IS NULL
            BEGIN
                SELECT TOP (1) @adminId = id
                FROM dbo.users
                ORDER BY id;
            END;

            DECLARE @defaultGroupId INT = (
                SELECT TOP (1) id
                FROM dbo.groups
                ORDER BY id
            );

            IF @defaultGroupId IS NULL AND @adminId IS NOT NULL
            BEGIN
                INSERT INTO dbo.groups (nome, gestor_id, ativo, criado_em)
                VALUES (N'Grupo Padrao', @adminId, 1, GETUTCDATE());

                SET @defaultGroupId = SCOPE_IDENTITY();
            END;

            IF OBJECT_ID(N'dbo.user_group_memberships', N'U') IS NULL
            BEGIN
                CREATE TABLE dbo.user_group_memberships
                (
                    user_id INT NOT NULL,
                    group_id INT NOT NULL,
                    criado_em DATETIME2 NOT NULL CONSTRAINT DF_user_group_memberships_criado_em DEFAULT (GETUTCDATE()),
                    CONSTRAINT PK_user_group_memberships PRIMARY KEY (user_id, group_id)
                );
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.indexes
                WHERE name = N'IX_user_group_memberships_group_id'
                  AND object_id = OBJECT_ID(N'dbo.user_group_memberships')
            )
            BEGIN
                CREATE INDEX IX_user_group_memberships_group_id ON dbo.user_group_memberships(group_id);
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.foreign_keys
                WHERE name = N'FK_user_group_memberships_users_user_id'
            )
            BEGIN
                ALTER TABLE dbo.user_group_memberships
                ADD CONSTRAINT FK_user_group_memberships_users_user_id
                FOREIGN KEY (user_id) REFERENCES dbo.users(id);
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.foreign_keys
                WHERE name = N'FK_user_group_memberships_groups_group_id'
            )
            BEGIN
                ALTER TABLE dbo.user_group_memberships
                ADD CONSTRAINT FK_user_group_memberships_groups_group_id
                FOREIGN KEY (group_id) REFERENCES dbo.groups(id);
            END;

            IF @defaultGroupId IS NOT NULL
            BEGIN
                INSERT INTO dbo.user_group_memberships (user_id, group_id, criado_em)
                SELECT u.id, @defaultGroupId, GETUTCDATE()
                FROM dbo.users u
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM dbo.user_group_memberships ugm
                    WHERE ugm.user_id = u.id
                      AND ugm.group_id = @defaultGroupId
                );
            END;

            IF OBJECT_ID(N'dbo.patients', N'U') IS NULL
            BEGIN
                CREATE TABLE dbo.patients
                (
                    id INT IDENTITY(1,1) NOT NULL,
                    nome NVARCHAR(200) NOT NULL,
                    idade INT NULL,
                    avaliador_id INT NULL,
                    group_id INT NOT NULL,
                    criado_em DATETIME2 NOT NULL CONSTRAINT DF_patients_criado_em DEFAULT (GETUTCDATE()),
                    CONSTRAINT PK_patients PRIMARY KEY (id)
                );
            END;

            IF COL_LENGTH(N'dbo.patients', N'group_id') IS NULL
            BEGIN
                EXEC(N'ALTER TABLE dbo.patients ADD group_id INT NULL;');
            END;

            IF @defaultGroupId IS NOT NULL AND COL_LENGTH(N'dbo.patients', N'group_id') IS NOT NULL
            BEGIN
                EXEC sp_executesql
                    N'UPDATE dbo.patients SET group_id = @groupId WHERE group_id IS NULL;',
                    N'@groupId INT',
                    @groupId = @defaultGroupId;
            END;

            IF EXISTS (
                SELECT 1
                FROM sys.columns
                WHERE object_id = OBJECT_ID(N'dbo.patients')
                  AND name = N'group_id'
                  AND is_nullable = 1
            )
            BEGIN
                IF EXISTS (
                    SELECT 1
                    FROM sys.foreign_keys
                    WHERE name = N'FK_patients_groups_group_id'
                )
                BEGIN
                    ALTER TABLE dbo.patients DROP CONSTRAINT FK_patients_groups_group_id;
                END;

                IF EXISTS (
                    SELECT 1
                    FROM sys.indexes
                    WHERE name = N'IX_patients_group_id'
                      AND object_id = OBJECT_ID(N'dbo.patients')
                )
                BEGIN
                    DROP INDEX IX_patients_group_id ON dbo.patients;
                END;

                DECLARE @patientsWithoutGroup INT;
                EXEC sp_executesql
                    N'SELECT @count = COUNT(1) FROM dbo.patients WHERE group_id IS NULL;',
                    N'@count INT OUTPUT',
                    @count = @patientsWithoutGroup OUTPUT;

                IF @patientsWithoutGroup = 0
                BEGIN
                    EXEC(N'ALTER TABLE dbo.patients ALTER COLUMN group_id INT NOT NULL;');
                END;
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.indexes
                WHERE name = N'IX_patients_avaliador_id'
                  AND object_id = OBJECT_ID(N'dbo.patients')
            )
            BEGIN
                CREATE INDEX IX_patients_avaliador_id ON dbo.patients(avaliador_id);
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.indexes
                WHERE name = N'IX_patients_group_id'
                  AND object_id = OBJECT_ID(N'dbo.patients')
            )
            AND COL_LENGTH(N'dbo.patients', N'group_id') IS NOT NULL
            BEGIN
                CREATE INDEX IX_patients_group_id ON dbo.patients(group_id);
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.foreign_keys
                WHERE name = N'FK_patients_users_avaliador_id'
            )
            BEGIN
                ALTER TABLE dbo.patients
                ADD CONSTRAINT FK_patients_users_avaliador_id
                FOREIGN KEY (avaliador_id) REFERENCES dbo.users(id);
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.foreign_keys
                WHERE name = N'FK_patients_groups_group_id'
            )
            AND COL_LENGTH(N'dbo.patients', N'group_id') IS NOT NULL
            BEGIN
                ALTER TABLE dbo.patients
                ADD CONSTRAINT FK_patients_groups_group_id
                FOREIGN KEY (group_id) REFERENCES dbo.groups(id);
            END;

            IF OBJECT_ID(N'dbo.form_templates', N'U') IS NULL
            BEGIN
                CREATE TABLE dbo.form_templates
                (
                    id INT IDENTITY(1,1) NOT NULL,
                    nome NVARCHAR(200) NOT NULL,
                    descricao NVARCHAR(1000) NULL,
                    group_id INT NULL,
                    criado_por_usuario_id INT NOT NULL,
                    ativo BIT NOT NULL CONSTRAINT DF_form_templates_ativo DEFAULT ((1)),
                    criado_em DATETIME2 NOT NULL CONSTRAINT DF_form_templates_criado_em DEFAULT (GETUTCDATE()),
                    atualizado_em DATETIME2 NOT NULL CONSTRAINT DF_form_templates_atualizado_em DEFAULT (GETUTCDATE()),
                    CONSTRAINT PK_form_templates PRIMARY KEY (id)
                );
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.indexes
                WHERE name = N'IX_form_templates_group_id'
                  AND object_id = OBJECT_ID(N'dbo.form_templates')
            )
            BEGIN
                CREATE INDEX IX_form_templates_group_id ON dbo.form_templates(group_id);
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.indexes
                WHERE name = N'IX_form_templates_criado_por_usuario_id'
                  AND object_id = OBJECT_ID(N'dbo.form_templates')
            )
            BEGIN
                CREATE INDEX IX_form_templates_criado_por_usuario_id ON dbo.form_templates(criado_por_usuario_id);
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.foreign_keys
                WHERE name = N'FK_form_templates_groups_group_id'
            )
            BEGIN
                ALTER TABLE dbo.form_templates
                ADD CONSTRAINT FK_form_templates_groups_group_id
                FOREIGN KEY (group_id) REFERENCES dbo.groups(id);
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.foreign_keys
                WHERE name = N'FK_form_templates_users_criado_por_usuario_id'
            )
            BEGIN
                ALTER TABLE dbo.form_templates
                ADD CONSTRAINT FK_form_templates_users_criado_por_usuario_id
                FOREIGN KEY (criado_por_usuario_id) REFERENCES dbo.users(id);
            END;

            IF OBJECT_ID(N'dbo.form_questions', N'U') IS NULL
            BEGIN
                CREATE TABLE dbo.form_questions
                (
                    id INT IDENTITY(1,1) NOT NULL,
                    form_template_id INT NOT NULL,
                    texto NVARCHAR(1000) NOT NULL,
                    peso DECIMAL(10,2) NOT NULL,
                    ordem INT NOT NULL,
                    ativa BIT NOT NULL CONSTRAINT DF_form_questions_ativa DEFAULT ((1)),
                    CONSTRAINT PK_form_questions PRIMARY KEY (id)
                );
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.indexes
                WHERE name = N'IX_form_questions_form_template_id'
                  AND object_id = OBJECT_ID(N'dbo.form_questions')
            )
            BEGIN
                CREATE INDEX IX_form_questions_form_template_id ON dbo.form_questions(form_template_id);
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.foreign_keys
                WHERE name = N'FK_form_questions_form_templates_form_template_id'
            )
            BEGIN
                ALTER TABLE dbo.form_questions
                ADD CONSTRAINT FK_form_questions_form_templates_form_template_id
                FOREIGN KEY (form_template_id) REFERENCES dbo.form_templates(id);
            END;

            IF OBJECT_ID(N'dbo.evaluations', N'U') IS NULL
            BEGIN
                CREATE TABLE dbo.evaluations
                (
                    id INT IDENTITY(1,1) NOT NULL,
                    patient_id INT NOT NULL,
                    avaliador_id INT NOT NULL,
                    group_id INT NOT NULL,
                    form_template_id INT NULL,
                    respostas NVARCHAR(MAX) NOT NULL,
                    score_total DECIMAL(10,2) NOT NULL,
                    peso_total DECIMAL(10,2) NOT NULL,
                    classificacao NVARCHAR(50) NOT NULL,
                    data_avaliacao DATETIME2 NOT NULL CONSTRAINT DF_evaluations_data_avaliacao DEFAULT (GETUTCDATE()),
                    CONSTRAINT PK_evaluations PRIMARY KEY (id)
                );
            END;

            IF COL_LENGTH(N'dbo.evaluations', N'group_id') IS NULL
            BEGIN
                EXEC(N'ALTER TABLE dbo.evaluations ADD group_id INT NULL;');
            END;

            IF COL_LENGTH(N'dbo.evaluations', N'form_template_id') IS NULL
            BEGIN
                EXEC(N'ALTER TABLE dbo.evaluations ADD form_template_id INT NULL;');
            END;

            IF COL_LENGTH(N'dbo.evaluations', N'peso_total') IS NULL
            BEGIN
                EXEC(N'ALTER TABLE dbo.evaluations ADD peso_total DECIMAL(10,2) NOT NULL CONSTRAINT DF_evaluations_peso_total DEFAULT ((14.00));');
            END;

            IF @defaultGroupId IS NOT NULL AND COL_LENGTH(N'dbo.evaluations', N'group_id') IS NOT NULL
            BEGIN
                EXEC sp_executesql
                    N'UPDATE e
                      SET e.group_id = ISNULL(p.group_id, @groupId)
                      FROM dbo.evaluations e
                      LEFT JOIN dbo.patients p ON p.id = e.patient_id
                      WHERE e.group_id IS NULL;',
                    N'@groupId INT',
                    @groupId = @defaultGroupId;
            END;

            IF EXISTS (
                SELECT 1
                FROM sys.columns
                WHERE object_id = OBJECT_ID(N'dbo.evaluations')
                  AND name = N'group_id'
                  AND is_nullable = 1
            )
            BEGIN
                IF EXISTS (
                    SELECT 1
                    FROM sys.foreign_keys
                    WHERE name = N'FK_evaluations_groups_group_id'
                )
                BEGIN
                    ALTER TABLE dbo.evaluations DROP CONSTRAINT FK_evaluations_groups_group_id;
                END;

                IF EXISTS (
                    SELECT 1
                    FROM sys.indexes
                    WHERE name = N'IX_evaluations_group_id'
                      AND object_id = OBJECT_ID(N'dbo.evaluations')
                )
                BEGIN
                    DROP INDEX IX_evaluations_group_id ON dbo.evaluations;
                END;

                DECLARE @evaluationsWithoutGroup INT;
                EXEC sp_executesql
                    N'SELECT @count = COUNT(1) FROM dbo.evaluations WHERE group_id IS NULL;',
                    N'@count INT OUTPUT',
                    @count = @evaluationsWithoutGroup OUTPUT;

                IF @evaluationsWithoutGroup = 0
                BEGIN
                    EXEC(N'ALTER TABLE dbo.evaluations ALTER COLUMN group_id INT NOT NULL;');
                END;
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.indexes
                WHERE name = N'IX_evaluations_avaliador_id'
                  AND object_id = OBJECT_ID(N'dbo.evaluations')
            )
            BEGIN
                CREATE INDEX IX_evaluations_avaliador_id ON dbo.evaluations(avaliador_id);
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.indexes
                WHERE name = N'IX_evaluations_patient_id'
                  AND object_id = OBJECT_ID(N'dbo.evaluations')
            )
            BEGIN
                CREATE INDEX IX_evaluations_patient_id ON dbo.evaluations(patient_id);
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.indexes
                WHERE name = N'IX_evaluations_group_id'
                  AND object_id = OBJECT_ID(N'dbo.evaluations')
            )
            AND COL_LENGTH(N'dbo.evaluations', N'group_id') IS NOT NULL
            BEGIN
                CREATE INDEX IX_evaluations_group_id ON dbo.evaluations(group_id);
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.indexes
                WHERE name = N'IX_evaluations_form_template_id'
                  AND object_id = OBJECT_ID(N'dbo.evaluations')
            )
            BEGIN
                CREATE INDEX IX_evaluations_form_template_id ON dbo.evaluations(form_template_id);
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.foreign_keys
                WHERE name = N'FK_evaluations_users_avaliador_id'
            )
            BEGIN
                ALTER TABLE dbo.evaluations
                ADD CONSTRAINT FK_evaluations_users_avaliador_id
                FOREIGN KEY (avaliador_id) REFERENCES dbo.users(id);
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.foreign_keys
                WHERE name = N'FK_evaluations_patients_patient_id'
            )
            BEGIN
                ALTER TABLE dbo.evaluations
                ADD CONSTRAINT FK_evaluations_patients_patient_id
                FOREIGN KEY (patient_id) REFERENCES dbo.patients(id);
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.foreign_keys
                WHERE name = N'FK_evaluations_groups_group_id'
            )
            AND COL_LENGTH(N'dbo.evaluations', N'group_id') IS NOT NULL
            BEGIN
                ALTER TABLE dbo.evaluations
                ADD CONSTRAINT FK_evaluations_groups_group_id
                FOREIGN KEY (group_id) REFERENCES dbo.groups(id);
            END;

            IF NOT EXISTS (
                SELECT 1
                FROM sys.foreign_keys
                WHERE name = N'FK_evaluations_form_templates_form_template_id'
            )
            BEGIN
                ALTER TABLE dbo.evaluations
                ADD CONSTRAINT FK_evaluations_form_templates_form_template_id
                FOREIGN KEY (form_template_id) REFERENCES dbo.form_templates(id);
            END;
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            """
            IF OBJECT_ID(N'dbo.evaluations', N'U') IS NOT NULL DROP TABLE dbo.evaluations;
            IF OBJECT_ID(N'dbo.form_questions', N'U') IS NOT NULL DROP TABLE dbo.form_questions;
            IF OBJECT_ID(N'dbo.user_group_memberships', N'U') IS NOT NULL DROP TABLE dbo.user_group_memberships;
            IF OBJECT_ID(N'dbo.patients', N'U') IS NOT NULL DROP TABLE dbo.patients;
            IF OBJECT_ID(N'dbo.form_templates', N'U') IS NOT NULL DROP TABLE dbo.form_templates;
            IF OBJECT_ID(N'dbo.groups', N'U') IS NOT NULL DROP TABLE dbo.groups;
            IF OBJECT_ID(N'dbo.users', N'U') IS NOT NULL DROP TABLE dbo.users;
            """);
    }
}