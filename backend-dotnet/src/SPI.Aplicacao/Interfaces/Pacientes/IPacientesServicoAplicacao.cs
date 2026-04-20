using SPI.Application.DTOs.Patients;

namespace SPI.Application.Interfaces;

public interface IPatientsAppService
{
    Task<IReadOnlyCollection<PatientResponseDto>> ListAsync(int actorUserId, CancellationToken cancellationToken = default);
    Task<PatientResponseDto> CreateAsync(CreatePatientRequestDto request, int actorUserId, CancellationToken cancellationToken = default);
    Task<PatientResponseDto> UpdateAsync(int id, UpdatePatientRequestDto request, int actorUserId, CancellationToken cancellationToken = default);
}



