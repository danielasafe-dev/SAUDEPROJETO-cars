using Cars.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cars.Infrastructure.Data.Persistence.Configurations;

public sealed class PatientConfiguration : IEntityTypeConfiguration<Patient>
{
    public void Configure(EntityTypeBuilder<Patient> builder)
    {
        builder.ToTable("patients");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");

        builder.Property(x => x.Nome)
            .HasColumnName("nome")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.Idade)
            .HasColumnName("idade");

        builder.Property(x => x.AvaliadorId)
            .HasColumnName("avaliador_id");

        builder.Property(x => x.GroupId)
            .HasColumnName("group_id")
            .IsRequired();

        builder.Property(x => x.CriadoEm)
            .HasColumnName("criado_em")
            .HasColumnType("datetime2")
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired();

        builder.HasOne(x => x.Avaliador)
            .WithMany(x => x.PacientesCriados)
            .HasForeignKey(x => x.AvaliadorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Group)
            .WithMany(x => x.Patients)
            .HasForeignKey(x => x.GroupId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.GroupId);
    }
}
