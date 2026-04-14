using Cars.Domain.Entities;
using Cars.Domain.Repositories;
using Cars.Infrastructure.Data.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Cars.Infrastructure.Data.Repositories;

public sealed class PatientRepository : IPatientRepository
{
    private readonly AppDbContext _context;

    public PatientRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task<List<Patient>> ListAsync(CancellationToken cancellationToken = default) =>
        _context.Patients.AsNoTracking().OrderBy(x => x.Nome).ToListAsync(cancellationToken);

    public Task<Patient?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        _context.Patients.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task AddAsync(Patient patient, CancellationToken cancellationToken = default) =>
        _context.Patients.AddAsync(patient, cancellationToken).AsTask();
}
