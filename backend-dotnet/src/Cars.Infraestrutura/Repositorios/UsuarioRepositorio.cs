using Cars.Domain.Entities;
using Cars.Domain.Repositories;
using Cars.Infrastructure.Data.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Cars.Infrastructure.Data.Repositories;

public sealed class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task<List<User>> ListAsync(CancellationToken cancellationToken = default) =>
        _context.Users.AsNoTracking().OrderBy(x => x.Nome).ToListAsync(cancellationToken);

    public Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        _context.Users.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var normalized = email.Trim().ToLowerInvariant();
        return _context.Users.FirstOrDefaultAsync(x => x.Email == normalized, cancellationToken);
    }

    public Task AddAsync(User user, CancellationToken cancellationToken = default) =>
        _context.Users.AddAsync(user, cancellationToken).AsTask();
}
