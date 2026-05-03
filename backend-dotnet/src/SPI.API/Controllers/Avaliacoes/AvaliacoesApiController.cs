using SPI.Api.Extensions;
using SPI.Application.DTOs.Evaluations;
using SPI.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SPI.Api.Controllers;

[ApiController]
[Route("api/evaluations")]
[Authorize(Policy = "EvaluationAccess")]
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
        var result = await _evaluationsAppService.ListAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("stats")]
    public async Task<IActionResult> Stats(CancellationToken cancellationToken)
    {
        var result = await _evaluationsAppService.GetStatsAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEvaluationRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _evaluationsAppService.CreateAsync(request, User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpPut("{id:int}/referral")]
    public async Task<IActionResult> SaveReferral(int id, [FromBody] SaveEvaluationReferralRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _evaluationsAppService.SaveReferralAsync(id, request, User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var result = await _evaluationsAppService.GetByIdAsync(id, User.GetUserId(), cancellationToken);
        if (result is null)
        {
            return NotFound(new { detail = "Avaliacao nao encontrada" });
        }

        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Policy = "EvaluationManagement")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        await _evaluationsAppService.DeleteAsync(id, User.GetUserId(), cancellationToken);
        return Ok(new { message = "Avaliacao deletada" });
    }

    [HttpGet("{id:int}/export/excel")]
    public async Task<IActionResult> ExportExcel(int id, CancellationToken cancellationToken)
    {
        var file = await _evaluationsAppService.ExportExcelAsync(id, User.GetUserId(), cancellationToken);
        return File(file.Content, file.ContentType, file.FileName);
    }

    [HttpGet("{id:int}/export/pdf")]
    public async Task<IActionResult> ExportPdf(int id, CancellationToken cancellationToken)
    {
        var file = await _evaluationsAppService.ExportPdfAsync(id, User.GetUserId(), cancellationToken);
        return File(file.Content, file.ContentType, file.FileName);
    }
}



