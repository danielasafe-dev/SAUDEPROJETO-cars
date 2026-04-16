using Cars.Domain.Entities;
using Cars.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cars.Infrastructure.Data.Persistence.Configurations;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");

        builder.Property(x => x.Nome)
            .HasColumnName("nome")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.Email)
            .HasColumnName("email")
            .HasMaxLength(200)
            .IsRequired();

        builder.HasIndex(x => x.Email).IsUnique();

        builder.Property(x => x.SenhaHash)
            .HasColumnName("senha_hash")
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(x => x.Role)
            .HasColumnName("role")
            .HasMaxLength(30)
            .HasConversion(
                role => role.ToApiValue(),
                value => UserRoleExtensions.FromApiValue(value))
            .IsRequired();

        builder.Property(x => x.ChefiaId)
            .HasColumnName("chefia_id");

        builder.HasIndex(x => x.ChefiaId);

        builder.Property(x => x.Ativo)
            .HasColumnName("ativo")
            .HasDefaultValue(true)
            .IsRequired();

        builder.Property(x => x.CriadoEm)
            .HasColumnName("criado_em")
            .HasColumnType("datetime2")
            .HasDefaultValueSql("GETUTCDATE()")
            .IsRequired();

        builder.HasMany(x => x.ManagedGroups)
            .WithOne(x => x.Gestor)
            .HasForeignKey(x => x.GestorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Chefia)
            .WithMany(x => x.Subordinados)
            .HasForeignKey(x => x.ChefiaId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.GroupMemberships)
            .WithOne(x => x.User)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
