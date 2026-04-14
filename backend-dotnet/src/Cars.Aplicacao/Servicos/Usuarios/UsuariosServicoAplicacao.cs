using Cars.Application.DTOs.Users;
using Cars.Application.Interfaces;
using Cars.Application.Mappings;
using Cars.Domain.Repositories;

namespace Cars.Application.Services;

public sealed class UsersAppService : IUsersAppService
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UsersAppService(IUserRepository userRepository, IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyCollection<UserResponseDto>> ListAsync(CancellationToken cancellationToken = default)
    {
        var users = await _userRepository.ListAsync(cancellationToken);
        return users.Select(x => x.ToDto()).ToList();
    }

    public async Task DeactivateAsync(int userId, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
            ?? throw new KeyNotFoundException("Usuario nao encontrado.");

        user.Deactivate();
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}

