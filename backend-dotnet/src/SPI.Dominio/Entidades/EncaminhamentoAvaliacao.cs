using SPI.Domain.Common;

namespace SPI.Domain.Entities;

public sealed class EvaluationReferral : Entity, IAggregateRoot
{
    private EvaluationReferral()
    {
    }

    public EvaluationReferral(
        int evaluationId,
        int patientId,
        int criadoPorUsuarioId,
        bool encaminhado,
        string? especialidade,
        decimal custoEstimado)
    {
        if (evaluationId <= 0)
        {
            throw new InvalidOperationException("Avaliacao invalida.");
        }

        if (patientId <= 0)
        {
            throw new InvalidOperationException("Paciente invalido.");
        }

        if (criadoPorUsuarioId <= 0)
        {
            throw new InvalidOperationException("Usuario invalido.");
        }

        EvaluationId = evaluationId;
        PatientId = patientId;
        CriadoPorUsuarioId = criadoPorUsuarioId;
        CriadoEm = DateTime.UtcNow;

        UpdateDecision(encaminhado, especialidade, custoEstimado);
    }

    public int EvaluationId { get; private set; }
    public int PatientId { get; private set; }
    public bool Encaminhado { get; private set; }
    public string? Especialidade { get; private set; }
    public decimal CustoEstimado { get; private set; }
    public DateTime CriadoEm { get; private set; }
    public int CriadoPorUsuarioId { get; private set; }
    public int? OrganizationId { get; private set; }

    public Evaluation Evaluation { get; private set; } = null!;
    public Patient Patient { get; private set; } = null!;
    public User CriadoPorUsuario { get; private set; } = null!;
    public Organization? Organization { get; private set; }

    public void AssignOrganization(int organizationId) => OrganizationId = organizationId;

    public void UpdateDecision(bool encaminhado, string? especialidade, decimal custoEstimado)
    {
        var normalizedSpecialty = string.IsNullOrWhiteSpace(especialidade) ? null : especialidade.Trim();

        if (encaminhado && string.IsNullOrWhiteSpace(normalizedSpecialty))
        {
            throw new InvalidOperationException("Especialidade do encaminhamento e obrigatoria.");
        }

        if (encaminhado && custoEstimado <= 0)
        {
            throw new InvalidOperationException("Custo estimado do encaminhamento deve ser maior que zero.");
        }

        Encaminhado = encaminhado;
        Especialidade = encaminhado ? normalizedSpecialty : null;
        CustoEstimado = encaminhado ? custoEstimado : 0;
    }
}
