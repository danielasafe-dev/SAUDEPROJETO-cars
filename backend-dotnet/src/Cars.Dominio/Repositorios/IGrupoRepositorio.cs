using Cars.Domain.Entities;

namespace Cars.Domain.Repositories;

public interface IGroupRepository
{
    Task<List<Group>> ListAsync(CancellationToken cancellationToken = default);
    Task<List<Group>> ListByIdsAsync(IReadOnlyCollection<int> groupIds, CancellationToken cancellationToken = default);
    Task<Group?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Group?> GetDetailedByIdAsync(int id, CancellationToken cancellationToken = default);
    Task AddAsync(Group group, CancellationToken cancellationToken = default);
}
