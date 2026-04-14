using Cars.Api.Extensions;
using Cars.Application.DTOs.Patients;
using Cars.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cars.Api.Controllers;

[ApiController]
[Route("api/patients")]
[Authorize]
public sealed class PatientsController : ControllerBase
{
    private readonly IPatientsAppService _patientsAppService;

    public PatientsController(IPatientsAppService patientsAppService)
    {
        _patientsAppService = patientsAppService;
    }

    [HttpGet]
    public async Task<IActionResult> List(CancellationToken cancellationToken)
    {
        var result = await _patientsAppService.ListAsync(cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePatientRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _patientsAppService.CreateAsync(request, User.GetUserId(), cancellationToken);
        return Ok(result);
    }
}
