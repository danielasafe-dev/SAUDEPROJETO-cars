using Cars.Api.Extensions;
using Cars.Application.DTOs.Evaluations;
using Cars.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cars.Api.Controllers;

[ApiController]
[Route("api/evaluations")]
[Authorize]
public sealed class EvaluationsController : ControllerBase
{
    private readonly IEvaluationsAppService _evaluationsAppService;

    public EvaluationsController(IEvaluationsAppService evaluationsAppService)
    {
        _evaluationsAppService = evaluationsAppService;
    }

    [HttpGet]
    public async Task<IActionResult> List(CancellationToken cancellationToken)
    {
        var result = await _evaluationsAppService.ListAsync(cancellationToken);
        return Ok(result);
    }

    [HttpGet("stats")]
    public async Task<IActionResult> Stats(CancellationToken cancellationToken)
    {
        var result = await _evaluationsAppService.GetStatsAsync(cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEvaluationRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _evaluationsAppService.CreateAsync(request, User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var result = await _evaluationsAppService.GetByIdAsync(id, cancellationToken);
        if (result is null)
        {
            return NotFound(new { detail = "Avaliacao nao encontrada" });
        }

        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        await _evaluationsAppService.DeleteAsync(id, cancellationToken);
        return Ok(new { message = "Avaliacao deletada" });
    }
}
