using Cars.Domain.Entities;

namespace Cars.Application.Interfaces.Seguranca;

public interface IPasswordInviteTokenService
{
    string Generate(User user);
    PasswordInviteTokenPayload Validate(string token);
}

public sealed record PasswordInviteTokenPayload(int UserId, string PasswordHashSnapshot);
