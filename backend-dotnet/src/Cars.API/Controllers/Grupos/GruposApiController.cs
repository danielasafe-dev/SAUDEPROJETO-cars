using Cars.Api.Extensions;
using Cars.Application.DTOs.Groups;
using Cars.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cars.Api.Controllers;

[ApiController]
[Route("api/groups")]
[Authorize(Policy = "GroupAccess")]
public sealed class GroupsController : ControllerBase
{
    private readonly IGroupsAppService _groupsAppService;

    public GroupsController(IGroupsAppService groupsAppService)
    {
        _groupsAppService = groupsAppService;
    }

    [HttpGet]
    public async Task<IActionResult> List(CancellationToken cancellationToken)
    {
        var result = await _groupsAppService.ListAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Policy = "GroupManagement")]
    public async Task<IActionResult> Create([FromBody] CreateGroupRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _groupsAppService.CreateAsync(request, User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpPut("{groupId:int}")]
    [Authorize(Policy = "GroupManagement")]
    public async Task<IActionResult> Update(int groupId, [FromBody] UpdateGroupRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _groupsAppService.UpdateAsync(groupId, request, User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{groupId:int}")]
    [Authorize(Policy = "GroupManagement")]
    public async Task<IActionResult> Delete(int groupId, CancellationToken cancellationToken)
    {
        await _groupsAppService.DeleteAsync(groupId, User.GetUserId(), cancellationToken);
        return Ok(new { message = "Grupo excluido" });
    }
}
