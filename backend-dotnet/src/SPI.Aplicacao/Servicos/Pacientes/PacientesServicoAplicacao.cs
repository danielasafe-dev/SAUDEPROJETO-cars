using SPI.Application.DTOs.Patients;
using SPI.Application.Interfaces;
using SPI.Application.Mappings;
using SPI.Application.Services.Access;
using SPI.Domain.Enums;
using SPI.Domain.Repositories;

namespace SPI.Application.Services;

public sealed class PatientsAppService : IPatientsAppService
{
    private readonly IPatientRepository _patientRepository;
    private readonly IUserRepository _userRepository;
    private readonly IGroupRepository _groupRepository;
    private readonly IUnitOfWork _unitOfWork;

    public PatientsAppService(
        IPatientRepository patientRepository,
        IUserRepository userRepository,
        IGroupRepository groupRepository,
        IUnitOfWork unitOfWork)
    {
        _patientRepository = patientRepository;
        _userRepository = userRepository;
        _groupRepository = groupRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyCollection<PatientResponseDto>> ListAsync(int actorUserId, CancellationToken cancellationToken = default)
    {
        var actor = await _userRepository.GetDetailedByIdAsync(actorUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Usuario autenticado nao encontrado.");

        if (!actor.Role.CanAccessOperationalModules())
        {
            throw new UnauthorizedAccessException("Usuario sem permissao para acessar pacientes.");
        }

        var accessScope = AccessScopeResolver.Resolve(actor);
        var patients = actor.Role == UserRole.Admin
            ? await _patientRepository.ListAsync(cancellationToken)
            : await _patientRepository.ListByGroupIdsAsync(accessScope.OperationalGroupIds, cancellationToken);

        return patients.Select(x => x.ToDto()).ToList();
    }

    public async Task<PatientResponseDto> CreateAsync(CreatePatientRequestDto request, int actorUserId, CancellationToken cancellationToken = default)
    {
        var actor = await _userRepository.GetDetailedByIdAsync(actorUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Usuario autenticado nao encontrado.");

        if (!actor.Role.CanAccessOperationalModules())
        {
            throw new UnauthorizedAccessException("Usuario sem permissao para cadastrar pacientes.");
        }

        var accessScope = AccessScopeResolver.Resolve(actor);
        var groupId = ResolveGroupId(request.GroupId, actor.Role, accessScope);
        var group = await _groupRepository.GetByIdAsync(groupId, cancellationToken)
            ?? throw new KeyNotFoundException("Grupo nao encontrado.");

        var patient = new SPI.Domain.Entities.Patient(request.Nome, request.Idade, actorUserId, group.Id);
        await _patientRepository.AddAsync(patient, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var createdPatient = await _patientRepository.GetByIdAsync(patient.Id, cancellationToken)
            ?? throw new InvalidOperationException("Nao foi possivel carregar o paciente criado.");

        return createdPatient.ToDto();
    }

    private static int ResolveGroupId(int? requestGroupId, UserRole actorRole, AccessScope accessScope)
    {
        if (requestGroupId.HasValue && requestGroupId.Value > 0)
        {
            if (actorRole != UserRole.Admin && !accessScope.OperationalGroupIds.Contains(requestGroupId.Value))
            {
                throw new UnauthorizedAccessException("Usuario sem permissao para operar neste grupo.");
            }

            return requestGroupId.Value;
        }

        if (actorRole == UserRole.Admin)
        {
            throw new InvalidOperationException("Administradores devem informar o grupo do paciente.");
        }

        if (accessScope.OperationalGroupIds.Count == 1)
        {
            return accessScope.OperationalGroupIds.Single();
        }

        throw new InvalidOperationException("O grupo do paciente deve ser informado.");
    }
}



