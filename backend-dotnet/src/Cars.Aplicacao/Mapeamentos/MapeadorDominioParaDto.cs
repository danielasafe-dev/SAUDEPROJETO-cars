using Cars.Application.DTOs.Evaluations;
using Cars.Application.DTOs.Forms;
using Cars.Application.DTOs.Groups;
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
        PodeAvaliar = user.Role.CanEvaluate(),
        GroupIds = user.GroupMemberships
            .Select(x => x.GroupId)
            .Distinct()
            .OrderBy(x => x)
            .ToArray(),
        GroupNames = user.GroupMemberships
            .Where(x => x.Group is not null)
            .Select(x => x.Group.Nome)
            .Distinct()
            .OrderBy(x => x)
            .ToArray(),
        CriadoEm = user.CriadoEm
    };

    public static PatientResponseDto ToDto(this Patient patient) => new()
    {
        Id = patient.Id,
        Nome = patient.Nome,
        Idade = patient.Idade,
        AvaliadorId = patient.AvaliadorId,
        GroupId = patient.GroupId,
        GroupNome = patient.Group.Nome,
        CriadoEm = patient.CriadoEm
    };

    public static EvaluationResponseDto ToDto(this EvaluationDetails evaluation) => new()
    {
        Id = evaluation.Id,
        PatientId = evaluation.PatientId,
        PatientNome = evaluation.PatientNome,
        AvaliadorId = evaluation.AvaliadorId,
        AvaliadorNome = evaluation.AvaliadorNome,
        GroupId = evaluation.GroupId,
        GroupNome = evaluation.GroupNome,
        FormId = evaluation.FormTemplateId,
        FormNome = evaluation.FormNome,
        Respostas = new Dictionary<int, int>(evaluation.Respostas),
        ScoreTotal = evaluation.ScoreTotal,
        PesoTotal = evaluation.PesoTotal,
        Classificacao = evaluation.Classificacao,
        DataAvaliacao = evaluation.DataAvaliacao
    };

    public static GroupResponseDto ToDto(this Group group) => new()
    {
        Id = group.Id,
        Nome = group.Nome,
        GestorId = group.GestorId,
        GestorNome = group.Gestor?.Nome ?? string.Empty,
        Ativo = group.Ativo,
        QuantidadeMembros = group.Members.Select(x => x.UserId).Distinct().Count(),
        CriadoEm = group.CriadoEm
    };

    public static FormResponseDto ToDto(this FormTemplate form) => new()
    {
        Id = form.Id,
        Nome = form.Nome,
        Descricao = form.Descricao,
        GroupId = form.GroupId,
        GroupNome = form.Group?.Nome,
        CriadoPorUsuarioId = form.CriadoPorUsuarioId,
        CriadoPorNome = form.CriadoPorUsuario?.Nome ?? string.Empty,
        Ativo = form.Ativo,
        PesoTotal = form.PesoTotal,
        CriadoEm = form.CriadoEm,
        AtualizadoEm = form.AtualizadoEm,
        Perguntas = form.Questions
            .OrderBy(x => x.Ordem)
            .Select(x => new FormQuestionResponseDto
            {
                Id = x.Id,
                Texto = x.Texto,
                Peso = x.Peso,
                Ordem = x.Ordem,
                Ativa = x.Ativa
            })
            .ToArray()
    };
}
