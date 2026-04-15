using System;
using Cars.Infrastructure.Data.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

#nullable disable

namespace Cars.Infrastructure.Data.Migrations;

[DbContext(typeof(AppDbContext))]
partial class AppDbContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
#pragma warning disable 612, 618
        modelBuilder
            .HasAnnotation("ProductVersion", "10.0.0")
            .HasAnnotation("Relational:MaxIdentifierLength", 128);

        SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

        modelBuilder.Entity("Cars.Domain.Entities.User", b =>
        {
            b.Property<int>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("int")
                .HasColumnName("id");

            SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

            b.Property<bool>("Ativo")
                .ValueGeneratedOnAdd()
                .HasColumnType("bit")
                .HasColumnName("ativo")
                .HasDefaultValue(true);

            b.Property<DateTime>("CriadoEm")
                .ValueGeneratedOnAdd()
                .HasColumnType("datetime2")
                .HasColumnName("criado_em")
                .HasDefaultValueSql("GETUTCDATE()");

            b.Property<string>("Email")
                .IsRequired()
                .HasMaxLength(200)
                .HasColumnType("nvarchar(200)")
                .HasColumnName("email");

            b.Property<string>("Nome")
                .IsRequired()
                .HasMaxLength(200)
                .HasColumnType("nvarchar(200)")
                .HasColumnName("nome");

            b.Property<string>("Role")
                .IsRequired()
                .HasMaxLength(30)
                .HasColumnType("nvarchar(30)")
                .HasColumnName("role");

            b.Property<string>("SenhaHash")
                .IsRequired()
                .HasMaxLength(256)
                .HasColumnType("nvarchar(256)")
                .HasColumnName("senha_hash");

            b.HasKey("Id");
            b.HasIndex("Email").IsUnique();
            b.ToTable("users", (string)null);
        });

        modelBuilder.Entity("Cars.Domain.Entities.Group", b =>
        {
            b.Property<int>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("int")
                .HasColumnName("id");

            SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

            b.Property<bool>("Ativo")
                .ValueGeneratedOnAdd()
                .HasColumnType("bit")
                .HasColumnName("ativo")
                .HasDefaultValue(true);

            b.Property<DateTime>("CriadoEm")
                .ValueGeneratedOnAdd()
                .HasColumnType("datetime2")
                .HasColumnName("criado_em")
                .HasDefaultValueSql("GETUTCDATE()");

            b.Property<int>("GestorId")
                .HasColumnType("int")
                .HasColumnName("gestor_id");

            b.Property<string>("Nome")
                .IsRequired()
                .HasMaxLength(200)
                .HasColumnType("nvarchar(200)")
                .HasColumnName("nome");

            b.HasKey("Id");
            b.HasIndex("GestorId");
            b.ToTable("groups", (string)null);
        });

        modelBuilder.Entity("Cars.Domain.Entities.FormTemplate", b =>
        {
            b.Property<int>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("int")
                .HasColumnName("id");

            SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

            b.Property<bool>("Ativo")
                .ValueGeneratedOnAdd()
                .HasColumnType("bit")
                .HasColumnName("ativo")
                .HasDefaultValue(true);

            b.Property<DateTime>("AtualizadoEm")
                .ValueGeneratedOnAdd()
                .HasColumnType("datetime2")
                .HasColumnName("atualizado_em")
                .HasDefaultValueSql("GETUTCDATE()");

            b.Property<DateTime>("CriadoEm")
                .ValueGeneratedOnAdd()
                .HasColumnType("datetime2")
                .HasColumnName("criado_em")
                .HasDefaultValueSql("GETUTCDATE()");

            b.Property<int>("CriadoPorUsuarioId")
                .HasColumnType("int")
                .HasColumnName("criado_por_usuario_id");

            b.Property<string>("Descricao")
                .HasMaxLength(1000)
                .HasColumnType("nvarchar(1000)")
                .HasColumnName("descricao");

            b.Property<int?>("GroupId")
                .HasColumnType("int")
                .HasColumnName("group_id");

            b.Property<string>("Nome")
                .IsRequired()
                .HasMaxLength(200)
                .HasColumnType("nvarchar(200)")
                .HasColumnName("nome");

            b.HasKey("Id");
            b.HasIndex("CriadoPorUsuarioId");
            b.HasIndex("GroupId");
            b.ToTable("form_templates", (string)null);
        });

        modelBuilder.Entity("Cars.Domain.Entities.Patient", b =>
        {
            b.Property<int>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("int")
                .HasColumnName("id");

            SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

            b.Property<int?>("AvaliadorId")
                .HasColumnType("int")
                .HasColumnName("avaliador_id");

            b.Property<DateTime>("CriadoEm")
                .ValueGeneratedOnAdd()
                .HasColumnType("datetime2")
                .HasColumnName("criado_em")
                .HasDefaultValueSql("GETUTCDATE()");

            b.Property<int>("GroupId")
                .HasColumnType("int")
                .HasColumnName("group_id");

            b.Property<int?>("Idade")
                .HasColumnType("int")
                .HasColumnName("idade");

            b.Property<string>("Nome")
                .IsRequired()
                .HasMaxLength(200)
                .HasColumnType("nvarchar(200)")
                .HasColumnName("nome");

            b.HasKey("Id");
            b.HasIndex("AvaliadorId");
            b.HasIndex("GroupId");
            b.ToTable("patients", (string)null);
        });

        modelBuilder.Entity("Cars.Domain.Entities.FormQuestion", b =>
        {
            b.Property<int>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("int")
                .HasColumnName("id");

            SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

            b.Property<bool>("Ativa")
                .ValueGeneratedOnAdd()
                .HasColumnType("bit")
                .HasColumnName("ativa")
                .HasDefaultValue(true);

            b.Property<int>("FormTemplateId")
                .HasColumnType("int")
                .HasColumnName("form_template_id");

            b.Property<int>("Ordem")
                .HasColumnType("int")
                .HasColumnName("ordem");

            b.Property<decimal>("Peso")
                .HasPrecision(10, 2)
                .HasColumnType("decimal(10,2)")
                .HasColumnName("peso");

            b.Property<string>("Texto")
                .IsRequired()
                .HasMaxLength(1000)
                .HasColumnType("nvarchar(1000)")
                .HasColumnName("texto");

            b.HasKey("Id");
            b.HasIndex("FormTemplateId");
            b.ToTable("form_questions", (string)null);
        });

        modelBuilder.Entity("Cars.Domain.Entities.Evaluation", b =>
        {
            b.Property<int>("Id")
                .ValueGeneratedOnAdd()
                .HasColumnType("int")
                .HasColumnName("id");

            SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

            b.Property<int>("AvaliadorId")
                .HasColumnType("int")
                .HasColumnName("avaliador_id");

            b.Property<string>("Classificacao")
                .IsRequired()
                .HasMaxLength(50)
                .HasColumnType("nvarchar(50)")
                .HasColumnName("classificacao");

            b.Property<DateTime>("DataAvaliacao")
                .ValueGeneratedOnAdd()
                .HasColumnType("datetime2")
                .HasColumnName("data_avaliacao")
                .HasDefaultValueSql("GETUTCDATE()");

            b.Property<int?>("FormTemplateId")
                .HasColumnType("int")
                .HasColumnName("form_template_id");

            b.Property<int>("GroupId")
                .HasColumnType("int")
                .HasColumnName("group_id");

            b.Property<int>("PatientId")
                .HasColumnType("int")
                .HasColumnName("patient_id");

            b.Property<decimal>("PesoTotal")
                .HasPrecision(10, 2)
                .HasColumnType("decimal(10,2)")
                .HasColumnName("peso_total");

            b.Property<string>("Respostas")
                .IsRequired()
                .HasColumnType("nvarchar(max)")
                .HasColumnName("respostas");

            b.Property<decimal>("ScoreTotal")
                .HasPrecision(10, 2)
                .HasColumnType("decimal(10,2)")
                .HasColumnName("score_total");

            b.HasKey("Id");
            b.HasIndex("AvaliadorId");
            b.HasIndex("FormTemplateId");
            b.HasIndex("GroupId");
            b.HasIndex("PatientId");
            b.ToTable("evaluations", (string)null);
        });

        modelBuilder.Entity("Cars.Domain.Entities.UserGroupMembership", b =>
        {
            b.Property<int>("UserId")
                .HasColumnType("int")
                .HasColumnName("user_id");

            b.Property<int>("GroupId")
                .HasColumnType("int")
                .HasColumnName("group_id");

            b.Property<DateTime>("CriadoEm")
                .ValueGeneratedOnAdd()
                .HasColumnType("datetime2")
                .HasColumnName("criado_em")
                .HasDefaultValueSql("GETUTCDATE()");

            b.HasKey("UserId", "GroupId");
            b.HasIndex("GroupId");
            b.ToTable("user_group_memberships", (string)null);
        });

        modelBuilder.Entity("Cars.Domain.Entities.Group", b =>
        {
            b.HasOne("Cars.Domain.Entities.User", "Gestor")
                .WithMany("ManagedGroups")
                .HasForeignKey("GestorId")
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            b.Navigation("Gestor");
        });

        modelBuilder.Entity("Cars.Domain.Entities.FormTemplate", b =>
        {
            b.HasOne("Cars.Domain.Entities.User", "CriadoPorUsuario")
                .WithMany()
                .HasForeignKey("CriadoPorUsuarioId")
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            b.HasOne("Cars.Domain.Entities.Group", "Group")
                .WithMany("Forms")
                .HasForeignKey("GroupId")
                .OnDelete(DeleteBehavior.Restrict);

            b.Navigation("CriadoPorUsuario");
            b.Navigation("Group");
        });

        modelBuilder.Entity("Cars.Domain.Entities.Patient", b =>
        {
            b.HasOne("Cars.Domain.Entities.User", "Avaliador")
                .WithMany("PacientesCriados")
                .HasForeignKey("AvaliadorId")
                .OnDelete(DeleteBehavior.Restrict);

            b.HasOne("Cars.Domain.Entities.Group", "Group")
                .WithMany("Patients")
                .HasForeignKey("GroupId")
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            b.Navigation("Avaliador");
            b.Navigation("Group");
        });

        modelBuilder.Entity("Cars.Domain.Entities.FormQuestion", b =>
        {
            b.HasOne("Cars.Domain.Entities.FormTemplate", "FormTemplate")
                .WithMany("Questions")
                .HasForeignKey("FormTemplateId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            b.Navigation("FormTemplate");
        });

        modelBuilder.Entity("Cars.Domain.Entities.Evaluation", b =>
        {
            b.HasOne("Cars.Domain.Entities.User", "Avaliador")
                .WithMany("AvaliacoesRealizadas")
                .HasForeignKey("AvaliadorId")
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            b.HasOne("Cars.Domain.Entities.FormTemplate", "FormTemplate")
                .WithMany()
                .HasForeignKey("FormTemplateId")
                .OnDelete(DeleteBehavior.Restrict);

            b.HasOne("Cars.Domain.Entities.Group", "Group")
                .WithMany()
                .HasForeignKey("GroupId")
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            b.HasOne("Cars.Domain.Entities.Patient", "Patient")
                .WithMany("Avaliacoes")
                .HasForeignKey("PatientId")
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            b.Navigation("Avaliador");
            b.Navigation("FormTemplate");
            b.Navigation("Group");
            b.Navigation("Patient");
        });

        modelBuilder.Entity("Cars.Domain.Entities.UserGroupMembership", b =>
        {
            b.HasOne("Cars.Domain.Entities.Group", "Group")
                .WithMany("Members")
                .HasForeignKey("GroupId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            b.HasOne("Cars.Domain.Entities.User", "User")
                .WithMany("GroupMemberships")
                .HasForeignKey("UserId")
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            b.Navigation("Group");
            b.Navigation("User");
        });
#pragma warning restore 612, 618
    }
}
