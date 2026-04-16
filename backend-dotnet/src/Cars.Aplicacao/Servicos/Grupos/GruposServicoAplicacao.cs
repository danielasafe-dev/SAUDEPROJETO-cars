using Cars.Application.DTOs.Groups;
using Cars.Application.Interfaces;
using Cars.Application.Mappings;
using Cars.Application.Services.Access;
using Cars.Domain.Enums;
using Cars.Domain.Repositories;

namespace Cars.Application.Services;

public sealed class GroupsAppService : IGroupsAppService
{
    private readonly IGroupRepository _groupRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public GroupsAppService(IGroupRepository groupRepository, IUserRepository userRepository, IUnitOfWork unitOfWork)
    {
        _groupRepository = groupRepository;
        _userRepository = userRepository;
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
        var groups = actor.Role == UserRole.Admin
            ? await _groupRepository.ListAsync(cancellationToken)
            : await _groupRepository.ListByIdsAsync(accessScope.OperationalGroupIds, cancellationToken);

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
            throw new InvalidOperationException("O responsavel informado precisa ter perfil de gestor ou chefia.");
        }

        var group = new Cars.Domain.Entities.Group(request.Nome, gestor.Id);
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

        if (actor.Role.HasManagerPrivileges() && group.GestorId != actor.Id)
        {
            throw new UnauthorizedAccessException("Perfil de gestao so pode alterar o proprio grupo.");
        }

        var gestorId = actor.Role.HasManagerPrivileges() ? actor.Id : request.GestorId;
        var gestor = await _userRepository.GetByIdAsync(gestorId, cancellationToken)
            ?? throw new KeyNotFoundException("Responsavel pelo grupo nao encontrado.");

        if (!gestor.Role.HasManagerPrivileges())
        {
            throw new InvalidOperationException("O responsavel informado precisa ter perfil de gestor ou chefia.");
        }

        group.Update(request.Nome, gestor.Id);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var updated = await _groupRepository.GetDetailedByIdAsync(group.Id, cancellationToken)
            ?? throw new InvalidOperationException("Nao foi possivel carregar o grupo atualizado.");

        return updated.ToDto();
    }
}
