using System.Security.Claims;

namespace SPI.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static int GetUserId(this ClaimsPrincipal principal)
    {
        var claim = principal.FindFirstValue(ClaimTypes.NameIdentifier) ?? principal.FindFirstValue("sub");
        if (!int.TryParse(claim, out var userId))
        {
            throw new UnauthorizedAccessException("Usuario autenticado invalido.");
        }

        return userId;
    }
}



