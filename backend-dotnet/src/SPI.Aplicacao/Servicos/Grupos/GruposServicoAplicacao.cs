using SPI.Application.DTOs.Groups;
using SPI.Application.Interfaces;
using SPI.Application.Mappings;
using SPI.Application.Services.Access;
using SPI.Domain.Enums;
using SPI.Domain.Repositories;

using SPI.Application.Config;

namespace SPI.Application.Services;

public sealed class GroupsAppService : IGroupsAppService
{
    private readonly IGroupRepository _groupRepository;
    private readonly IUserRepository _userRepository;
    private readonly IEvaluationRepository _evaluationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public GroupsAppService(
        IGroupRepository groupRepository,
        IUserRepository userRepository,
        IEvaluationRepository evaluationRepository,
        IUnitOfWork unitOfWork)
    {
        _groupRepository = groupRepository;
        _userRepository = userRepository;
        _evaluationRepository = evaluationRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyCollection<GroupResponseDto>> ListAsync(int actorUserId, CancellationToken cancellationToken = default)
    {
        var actor = await _userRepository.GetDetailedByIdAsync(actorUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Usuario autenticado nao encontrado.");

        if (!actor.Role.CanAccessOperationalModules())
        {
            throw new UnauthorizedAccessException("Usuario sem permissao para acessar grupos.");
        }

        var accessScope = AccessScopeResolver.Resolve(actor);
        var groups = await _groupRepository.ListByIdsAsync(accessScope.OperationalGroupIds, cancellationToken);

        return groups.Select(x => x.ToDto()).ToList();
    }

    public async Task<GroupResponseDto> CreateAsync(CreateGroupRequestDto request, int actorUserId, CancellationToken cancellationToken = default)
    {
        var actor = await _userRepository.GetDetailedByIdAsync(actorUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Usuario autenticado nao encontrado.");

        if (!actor.Role.CanManageGroups())
        {
            throw new UnauthorizedAccessException("Usuario sem permissao para criar grupos.");
        }

        var gestorId = actor.Role.HasManagerPrivileges()
            ? actor.Id
            : request.GestorId ?? throw new InvalidOperationException("GestorId precisa ser informado.");

        var gestor = await _userRepository.GetByIdAsync(gestorId, cancellationToken)
            ?? throw new KeyNotFoundException("Responsavel pelo grupo nao encontrado.");

        if (!gestor.Role.HasManagerPrivileges())
        {
            throw new InvalidOperationException("O responsavel informado precisa ter perfil de gestor.");
        }

        SystemGroupRules.EnsureNameIsAvailable(request.Nome);

        var group = new SPI.Domain.Entities.Group(request.Nome, gestor.Id);
        await _groupRepository.AddAsync(group, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var created = await _groupRepository.GetDetailedByIdAsync(group.Id, cancellationToken)
            ?? throw new InvalidOperationException("Nao foi possivel carregar o grupo criado.");

        return created.ToDto();
    }

    public async Task<GroupResponseDto> UpdateAsync(int groupId, UpdateGroupRequestDto request, int actorUserId, CancellationToken cancellationToken = default)
    {
        var actor = await _userRepository.GetDetailedByIdAsync(actorUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Usuario autenticado nao encontrado.");

        if (!actor.Role.CanManageGroups())
        {
            throw new UnauthorizedAccessException("Usuario sem permissao para alterar grupos.");
        }

        var group = await _groupRepository.GetByIdAsync(groupId, cancellationToken)
            ?? throw new KeyNotFoundException("Grupo nao encontrado.");

        var accessScope = AccessScopeResolver.Resolve(actor);
        if (actor.Role == UserRole.Admin && !accessScope.OperationalGroupIds.Contains(group.Id))
        {
            throw new UnauthorizedAccessException("Administrador so pode alterar grupos aos quais esta vinculado.");
        }

        SystemGroupRules.EnsureGroupCanBeManaged(group);

        if (actor.Role.HasManagerPrivileges() && group.GestorId != actor.Id)
        {
            throw new UnauthorizedAccessException("Perfil de gestao so pode alterar o proprio grupo.");
        }

        var gestorId = actor.Role.HasManagerPrivileges() ? actor.Id : request.GestorId;
        var gestor = await _userRepository.GetByIdAsync(gestorId, cancellationToken)
            ?? throw new KeyNotFoundException("Responsavel pelo grupo nao encontrado.");

        if (!gestor.Role.HasManagerPrivileges())
        {
            throw new InvalidOperationException("O responsavel informado precisa ter perfil de gestor.");
        }

        var adminUser = await _userRepository
            .GetByEmailAsync("admin@spi.com", cancellationToken);
        if (adminUser is not null)
        {
            SystemGroupRules.EnsureManagerRemainsAdminForProtectedGroup(group, gestor.Id, adminUser.Id);
        }

        SystemGroupRules.EnsureNameIsAvailable(request.Nome);

        group.Update(request.Nome, gestor.Id);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var updated = await _groupRepository.GetDetailedByIdAsync(group.Id, cancellationToken)
            ?? throw new InvalidOperationException("Nao foi possivel carregar o grupo atualizado.");

        return updated.ToDto();
    }

    public async Task DeleteAsync(int groupId, int actorUserId, CancellationToken cancellationToken = default)
    {
        var actor = await _userRepository.GetDetailedByIdAsync(actorUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Usuario autenticado nao encontrado.");

        if (!actor.Role.CanManageGroups())
        {
            throw new UnauthorizedAccessException("Usuario sem permissao para excluir grupos.");
        }

        var group = await _groupRepository.GetDetailedByIdAsync(groupId, cancellationToken)
            ?? throw new KeyNotFoundException("Grupo nao encontrado.");

        var accessScope = AccessScopeResolver.Resolve(actor);
        if (actor.Role == UserRole.Admin && !accessScope.OperationalGroupIds.Contains(group.Id))
        {
            throw new UnauthorizedAccessException("Administrador so pode excluir grupos aos quais esta vinculado.");
        }

        SystemGroupRules.EnsureGroupCanBeDeleted(group);

        if (actor.Role.HasManagerPrivileges() && group.GestorId != actor.Id)
        {
            throw new UnauthorizedAccessException("Perfil de gestao so pode excluir o proprio grupo.");
        }

        if (group.Patients.Count != 0)
        {
            throw new InvalidOperationException("Nao e possivel excluir grupo com pacientes vinculados.");
        }

        if (group.Forms.Count != 0)
        {
            throw new InvalidOperationException("Nao e possivel excluir grupo com formularios vinculados.");
        }

        if (await _evaluationRepository.AnyByGroupIdAsync(group.Id, cancellationToken))
        {
            throw new InvalidOperationException("Nao e possivel excluir grupo com avaliacoes vinculadas.");
        }

        _groupRepository.Remove(group);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}



