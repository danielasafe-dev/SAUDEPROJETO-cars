using Cars.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cars.Infrastructure.Data.Persistence.Configurations;

public sealed class GroupConfiguration : IEntityTypeConfiguration<Group>
{
    public void Configure(EntityTypeBuilder<Group> builder)
    {
        builder.ToTable("groups");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");

        builder.Property(x => x.Nome)
            .HasColumnName("nome")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.GestorId)
            .HasColumnName("gestor_id")
            .IsRequired();

        builder.Property(x => x.Ativo)
            .HasColumnName("ativo")
            .HasDefaultValue(true)
            .IsRequired();

        builder.Property(x => x.CriadoEm)
            .HasColumnName("criado_em")
            .HasColumnType("datetime2")
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired();

        builder.HasIndex(x => x.GestorId);
    }
}
