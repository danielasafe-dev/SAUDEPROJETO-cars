using Cars.Api.Extensions;
using Cars.Application.DTOs.Profile;
using Cars.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cars.Api.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize]
public sealed class ProfileController : ControllerBase
{
    private readonly IProfileAppService _profileAppService;

    public ProfileController(IProfileAppService profileAppService)
    {
        _profileAppService = profileAppService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var result = await _profileAppService.GetAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateProfileRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _profileAppService.UpdateAsync(request, User.GetUserId(), cancellationToken);
        return Ok(result);
    }
}
