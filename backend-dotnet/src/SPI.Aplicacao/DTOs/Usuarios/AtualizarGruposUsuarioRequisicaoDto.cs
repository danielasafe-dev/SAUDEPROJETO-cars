using System.ComponentModel.DataAnnotations;

namespace SPI.Application.DTOs.Users;

public sealed class UpdateUserGroupsRequestDto
{
    [Required]
    public IReadOnlyCollection<int> GroupIds { get; init; } = [];
}



