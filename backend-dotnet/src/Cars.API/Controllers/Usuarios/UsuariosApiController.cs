using Cars.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cars.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public sealed class UsersController : ControllerBase
{
    private readonly IUsersAppService _usersAppService;

    public UsersController(IUsersAppService usersAppService)
    {
        _usersAppService = usersAppService;
    }

    [HttpGet]
    public async Task<IActionResult> List(CancellationToken cancellationToken)
    {
        var result = await _usersAppService.ListAsync(cancellationToken);
        return Ok(result);
    }

    [HttpPut("{userId:int}/deactivate")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Deactivate(int userId, CancellationToken cancellationToken)
    {
        await _usersAppService.DeactivateAsync(userId, cancellationToken);
        return Ok(new { message = "Usuario desativado" });
    }
}
