using Cars.Application.DTOs.Evaluations;
using Cars.Application.DTOs.Patients;
using Cars.Application.DTOs.Users;
using Cars.Domain.Entities;
using Cars.Domain.Enums;
using Cars.Domain.ReadModels;

namespace Cars.Application.Mappings;

public static class DomainToDtoMapper
{
    public static UserResponseDto ToDto(this User user) => new()
    {
        Id = user.Id,
        Nome = user.Nome,
        Email = user.Email,
        Role = user.Role.ToApiValue(),
        Ativo = user.Ativo,
        CriadoEm = user.CriadoEm
    };

    public static PatientResponseDto ToDto(this Patient patient) => new()
    {
        Id = patient.Id,
        Nome = patient.Nome,
        Idade = patient.Idade,
        AvaliadorId = patient.AvaliadorId,
        CriadoEm = patient.CriadoEm
    };

    public static EvaluationResponseDto ToDto(this EvaluationDetails evaluation) => new()
    {
        Id = evaluation.Id,
        PatientId = evaluation.PatientId,
        PatientNome = evaluation.PatientNome,
        AvaliadorId = evaluation.AvaliadorId,
        AvaliadorNome = evaluation.AvaliadorNome,
        Respostas = new Dictionary<int, int>(evaluation.Respostas),
        ScoreTotal = evaluation.ScoreTotal,
        Classificacao = evaluation.Classificacao,
        DataAvaliacao = evaluation.DataAvaliacao
    };
}
