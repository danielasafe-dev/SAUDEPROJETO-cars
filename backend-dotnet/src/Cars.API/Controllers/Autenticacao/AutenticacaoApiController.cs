using Cars.Api.Extensions;
using Cars.Application.DTOs.Auth;
using Cars.Application.DTOs.Users;
using Cars.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cars.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly IAuthAppService _authAppService;

    public AuthController(IAuthAppService authAppService)
    {
        _authAppService = authAppService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _authAppService.LoginAsync(request, cancellationToken);
        return Ok(result);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me(CancellationToken cancellationToken)
    {
        var result = await _authAppService.GetCurrentUserAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpPost("register")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Register([FromBody] CreateUserRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _authAppService.RegisterAsync(request, cancellationToken);
        return Ok(result);
    }
}
