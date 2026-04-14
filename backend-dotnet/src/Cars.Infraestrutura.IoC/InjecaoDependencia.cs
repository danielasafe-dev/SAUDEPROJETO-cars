using Cars.Application.Interfaces.Seguranca;
using Cars.Application.Interfaces;
using Cars.Application.Services;
using Cars.Domain.Repositories;
using Cars.Infrastructure.Data.Persistence;
using Cars.Infrastructure.Data.Repositories;
using Cars.Infrastructure.Data.Security;
using Cars.Infrastructure.Data.Seed;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Cars.Infrastructure.IoC;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));
        services.Configure<SeedOptions>(configuration.GetSection(SeedOptions.SectionName));

        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
        services.AddScoped<IUnitOfWork>(provider => provider.GetRequiredService<AppDbContext>());

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IGroupRepository, GroupRepository>();
        services.AddScoped<IPatientRepository, PatientRepository>();
        services.AddScoped<IFormRepository, FormRepository>();
        services.AddScoped<IEvaluationRepository, EvaluationRepository>();

        services.AddScoped<PasswordHasherAdapter>();
        services.AddScoped<IPasswordHasher>(provider => provider.GetRequiredService<PasswordHasherAdapter>());
        services.AddScoped<ITokenService, JwtTokenService>();

        services.AddScoped<IAuthAppService, AuthAppService>();
        services.AddScoped<IGroupsAppService, GroupsAppService>();
        services.AddScoped<IFormsAppService, FormsAppService>();
        services.AddScoped<IDashboardAppService, DashboardAppService>();
        services.AddScoped<IProfileAppService, ProfileAppService>();
        services.AddScoped<IUsersAppService, UsersAppService>();
        services.AddScoped<IPatientsAppService, PatientsAppService>();
        services.AddScoped<IEvaluationsAppService, EvaluationsAppService>();

        return services;
    }
}


