using Cars.Api.Extensions;
using Cars.Application.DTOs.Forms;
using Cars.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cars.Api.Controllers;

[ApiController]
[Route("api/forms")]
[Authorize(Policy = "FormAccess")]
public sealed class FormsController : ControllerBase
{
    private readonly IFormsAppService _formsAppService;

    public FormsController(IFormsAppService formsAppService)
    {
        _formsAppService = formsAppService;
    }

    [HttpGet]
    public async Task<IActionResult> List(CancellationToken cancellationToken)
    {
        var result = await _formsAppService.ListAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{formId:int}")]
    public async Task<IActionResult> GetById(int formId, CancellationToken cancellationToken)
    {
        var result = await _formsAppService.GetByIdAsync(formId, User.GetUserId(), cancellationToken);
        if (result is null)
        {
            return NotFound(new { detail = "Formulario nao encontrado" });
        }

        return Ok(result);
    }

    [HttpPost]
    [Authorize(Policy = "FormManagement")]
    public async Task<IActionResult> Create([FromBody] CreateFormRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _formsAppService.CreateAsync(request, User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpPut("{formId:int}")]
    [Authorize(Policy = "FormManagement")]
    public async Task<IActionResult> Update(int formId, [FromBody] UpdateFormRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _formsAppService.UpdateAsync(formId, request, User.GetUserId(), cancellationToken);
        return Ok(result);
    }
}
