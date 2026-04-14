using Cars.Domain.Entities;
using Cars.Domain.Enums;

namespace Cars.Application.Services.Access;

internal static class AccessScopeResolver
{
    public static AccessScope Resolve(User user)
    {
        var managedGroupIds = user.ManagedGroups
            .Select(x => x.Id)
            .Distinct()
            .OrderBy(x => x)
            .ToArray();

        var memberGroupIds = user.GroupMemberships
            .Select(x => x.GroupId)
            .Distinct()
            .OrderBy(x => x)
            .ToArray();

        return new AccessScope(
            user.Role == UserRole.Admin,
            user.Role == UserRole.Analyst,
            user.Role == UserRole.Manager,
            managedGroupIds,
            memberGroupIds);
    }
}
