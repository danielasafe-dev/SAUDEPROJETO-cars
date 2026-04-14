namespace Cars.Domain.Entities;

public sealed class UserGroupMembership
{
    private UserGroupMembership()
    {
    }

    public UserGroupMembership(int userId, int groupId)
    {
        if (userId <= 0)
        {
            throw new InvalidOperationException("Usuario invalido.");
        }

        if (groupId <= 0)
        {
            throw new InvalidOperationException("Grupo invalido.");
        }

        UserId = userId;
        GroupId = groupId;
        CriadoEm = DateTime.UtcNow;
    }

    public int UserId { get; private set; }
    public int GroupId { get; private set; }
    public DateTime CriadoEm { get; private set; }

    public User User { get; private set; } = null!;
    public Group Group { get; private set; } = null!;
}
