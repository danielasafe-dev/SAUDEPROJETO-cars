using Cars.Domain.Entities;

namespace Cars.Application.Interfaces.Seguranca;

public interface ITokenService
{
    string Generate(User user);
}
