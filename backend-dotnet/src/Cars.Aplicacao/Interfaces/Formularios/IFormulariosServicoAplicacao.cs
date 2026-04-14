using Cars.Application.DTOs.Forms;

namespace Cars.Application.Interfaces;

public interface IFormsAppService
{
    Task<IReadOnlyCollection<FormResponseDto>> ListAsync(int actorUserId, CancellationToken cancellationToken = default);
    Task<FormResponseDto?> GetByIdAsync(int formId, int actorUserId, CancellationToken cancellationToken = default);
    Task<FormResponseDto> CreateAsync(CreateFormRequestDto request, int actorUserId, CancellationToken cancellationToken = default);
    Task<FormResponseDto> UpdateAsync(int formId, UpdateFormRequestDto request, int actorUserId, CancellationToken cancellationToken = default);
}
