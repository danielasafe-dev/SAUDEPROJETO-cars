using System.ComponentModel.DataAnnotations;

namespace Cars.Application.DTOs.Users;

public sealed class UpdateUserGroupsRequestDto
{
    [Required]
    public IReadOnlyCollection<int> GroupIds { get; init; } = [];
}
