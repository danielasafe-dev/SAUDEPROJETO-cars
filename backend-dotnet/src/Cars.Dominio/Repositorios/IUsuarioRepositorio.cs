using Cars.Domain.Entities;

namespace Cars.Domain.Repositories;

public interface IUserRepository
{
    Task<List<User>> ListAsync(CancellationToken cancellationToken = default);
    Task<List<User>> ListByGroupIdsAsync(IReadOnlyCollection<int> groupIds, CancellationToken cancellationToken = default);
    Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<User?> GetDetailedByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task AddAsync(User user, CancellationToken cancellationToken = default);
    Task ReplaceGroupMembershipsAsync(int userId, IReadOnlyCollection<int> groupIds, CancellationToken cancellationToken = default);
}
