using Cars.Application.DTOs.Patients;

namespace Cars.Application.Interfaces;

public interface IPatientsAppService
{
    Task<IReadOnlyCollection<PatientResponseDto>> ListAsync(CancellationToken cancellationToken = default);
    Task<PatientResponseDto> CreateAsync(CreatePatientRequestDto request, int avaliadorId, CancellationToken cancellationToken = default);
}
