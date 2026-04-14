using Cars.Application.DTOs.Patients;

namespace Cars.Application.Interfaces;

public interface IPatientsAppService
{
    Task<IReadOnlyCollection<PatientResponseDto>> ListAsync(int actorUserId, CancellationToken cancellationToken = default);
    Task<PatientResponseDto> CreateAsync(CreatePatientRequestDto request, int actorUserId, CancellationToken cancellationToken = default);
}
