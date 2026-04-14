using Cars.Api.Extensions;
using Cars.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cars.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize(Policy = "DashboardAccess")]
public sealed class DashboardController : ControllerBase
{
    private readonly IDashboardAppService _dashboardAppService;

    public DashboardController(IDashboardAppService dashboardAppService)
    {
        _dashboardAppService = dashboardAppService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var result = await _dashboardAppService.GetAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }
}
