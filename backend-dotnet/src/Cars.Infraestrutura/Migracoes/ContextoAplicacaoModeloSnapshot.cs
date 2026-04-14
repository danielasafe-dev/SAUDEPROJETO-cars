using System;
using Cars.Infrastructure.Data.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Cars.Infrastructure.Data.Migrations;

[DbContext(typeof(AppDbContext))]
partial class AppDbContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
#pragma warning disable 612, 618
        modelBuilder
            .HasAnnotation("ProductVersion", "8.0.0")
            .HasAnnotation("Relational:MaxIdentifierLength", 128);

        SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

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

            b.Property<int>("PatientId")
                .HasColumnType("int")
                .HasColumnName("patient_id");

            b.Property<string>("Respostas")
                .IsRequired()
                .HasColumnType("nvarchar(max)")
                .HasColumnName("respostas");

            b.Property<decimal>("ScoreTotal")
                .HasPrecision(5, 1)
                .HasColumnType("decimal(5,1)")
                .HasColumnName("score_total");

            b.HasKey("Id");
            b.HasIndex("AvaliadorId");
            b.HasIndex("PatientId");
            b.ToTable("evaluations", (string)null);
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
            b.ToTable("patients", (string)null);
        });

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
                .HasMaxLength(20)
                .HasColumnType("nvarchar(20)")
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

        modelBuilder.Entity("Cars.Domain.Entities.Evaluation", b =>
        {
            b.HasOne("Cars.Domain.Entities.User", "Avaliador")
                .WithMany("AvaliacoesRealizadas")
                .HasForeignKey("AvaliadorId")
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            b.HasOne("Cars.Domain.Entities.Patient", "Patient")
                .WithMany("Avaliacoes")
                .HasForeignKey("PatientId")
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired();

            b.Navigation("Avaliador");
            b.Navigation("Patient");
        });

        modelBuilder.Entity("Cars.Domain.Entities.Patient", b =>
        {
            b.HasOne("Cars.Domain.Entities.User", "Avaliador")
                .WithMany("PacientesCriados")
                .HasForeignKey("AvaliadorId")
                .OnDelete(DeleteBehavior.Restrict);

            b.Navigation("Avaliador");
        });
#pragma warning restore 612, 618
    }
}
