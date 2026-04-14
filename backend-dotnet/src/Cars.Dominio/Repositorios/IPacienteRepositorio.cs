using Cars.Domain.Entities;

namespace Cars.Domain.Repositories;

public interface IPatientRepository
{
    Task<List<Patient>> ListAsync(CancellationToken cancellationToken = default);
    Task<Patient?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task AddAsync(Patient patient, CancellationToken cancellationToken = default);
}
