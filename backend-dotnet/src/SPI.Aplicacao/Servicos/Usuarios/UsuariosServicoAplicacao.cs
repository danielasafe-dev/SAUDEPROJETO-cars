using SPI.Application.DTOs.Users;
using SPI.Application.Interfaces;
using SPI.Application.Mappings;
using SPI.Application.Services.Access;
using SPI.Domain.Enums;
using SPI.Domain.Repositories;

using SPI.Application.Config;

namespace SPI.Application.Services;

public sealed class UsersAppService : IUsersAppService
{
    private readonly IUserRepository _userRepository;
    private readonly IGroupRepository _groupRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UsersAppService(IUserRepository userRepository, IGroupRepository groupRepository, IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _groupRepository = groupRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyCollection<UserResponseDto>> ListAsync(int actorUserId, CancellationToken cancellationToken = default)
    {
        var actor = await _userRepository.GetDetailedByIdAsync(actorUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Usuario autenticado nao encontrado.");

        if (!actor.Role.CanManageUsers())
        {
            throw new UnauthorizedAccessException("Usuario sem permissao para listar usuarios.");
        }

        var accessScope = AccessScopeResolver.Resolve(actor);
        var users = actor.Role == UserRole.Admin
            ? await _userRepository.ListAsync(cancellationToken)
            : await _userRepository.ListByGroupIdsAsync(accessScope.ManagedGroupIds, cancellationToken);

        return users.Select(x => x.ToDto()).ToList();
    }

    public async Task DeactivateAsync(int userId, int actorUserId, CancellationToken cancellationToken = default)
    {
        var actor = await _userRepository.GetDetailedByIdAsync(actorUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Usuario autenticado nao encontrado.");

        if (!actor.Role.CanManageUsers())
        {
            throw new UnauthorizedAccessException("Usuario sem permissao para desativar usuarios.");
        }

        var accessScope = AccessScopeResolver.Resolve(actor);
        var user = await _userRepository.GetDetailedByIdAsync(userId, cancellationToken)
            ?? throw new KeyNotFoundException("Usuario nao encontrado.");

        if (actor.Role.HasManagerPrivileges())
        {
            var targetGroupIds = user.GroupMemberships.Select(x => x.GroupId).Distinct().ToArray();
            if (targetGroupIds.Any() && targetGroupIds.Any(x => !accessScope.ManagedGroupIds.Contains(x)))
            {
                throw new UnauthorizedAccessException("Perfil de gestao so pode desativar usuarios dos grupos que gerencia.");
            }
        }

        user.Deactivate();
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateGroupsAsync(
        int userId,
        UpdateUserGroupsRequestDto request,
        int actorUserId,
        CancellationToken cancellationToken = default)
    {
        var actor = await _userRepository.GetDetailedByIdAsync(actorUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Usuario autenticado nao encontrado.");

        if (!actor.Role.CanManageUsers())
        {
            throw new UnauthorizedAccessException("Usuario sem permissao para alterar grupos.");
        }

        var user = await _userRepository.GetDetailedByIdAsync(userId, cancellationToken)
            ?? throw new KeyNotFoundException("Usuario nao encontrado.");

        var requestedGroupIds = request.GroupIds
            .Where(x => x > 0)
            .Distinct()
            .OrderBy(x => x)
            .ToArray();

        var groups = await _groupRepository.ListByIdsAsync(requestedGroupIds, cancellationToken);
        if (groups.Count != requestedGroupIds.Length)
        {
            throw new KeyNotFoundException("Um ou mais grupos informados nao existem.");
        }

        if (actor.Role.HasManagerPrivileges())
        {
            var accessScope = AccessScopeResolver.Resolve(actor);
            if (requestedGroupIds.Any(x => !accessScope.ManagedGroupIds.Contains(x)))
            {
                throw new UnauthorizedAccessException("Perfil de gestao so pode vincular usuarios aos grupos que gerencia.");
            }

            var currentGroupIds = user.GroupMemberships.Select(x => x.GroupId).Distinct().ToArray();
            if (currentGroupIds.Any(x => !accessScope.ManagedGroupIds.Contains(x)))
            {
                throw new UnauthorizedAccessException("Perfil de gestao so pode alterar usuarios dentro dos grupos que gerencia.");
            }
        }

        await _userRepository.ReplaceGroupMembershipsAsync(userId, requestedGroupIds, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}



