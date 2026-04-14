using Cars.Application.DTOs.Patients;
using Cars.Application.Interfaces;
using Cars.Application.Mappings;
using Cars.Domain.Entities;
using Cars.Domain.Repositories;

namespace Cars.Application.Services;

public sealed class PatientsAppService : IPatientsAppService
{
    private readonly IPatientRepository _patientRepository;
    private readonly IUnitOfWork _unitOfWork;

    public PatientsAppService(IPatientRepository patientRepository, IUnitOfWork unitOfWork)
    {
        _patientRepository = patientRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyCollection<PatientResponseDto>> ListAsync(CancellationToken cancellationToken = default)
    {
        var patients = await _patientRepository.ListAsync(cancellationToken);
        return patients.Select(x => x.ToDto()).ToList();
    }

    public async Task<PatientResponseDto> CreateAsync(CreatePatientRequestDto request, int avaliadorId, CancellationToken cancellationToken = default)
    {
        var patient = new Patient(request.Nome, request.Idade, avaliadorId);
        await _patientRepository.AddAsync(patient, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return patient.ToDto();
    }
}

