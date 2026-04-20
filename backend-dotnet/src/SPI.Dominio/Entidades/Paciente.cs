using SPI.Domain.Common;

namespace SPI.Domain.Entities;

public sealed class Patient : Entity, IAggregateRoot
{
    private Patient()
    {
    }

    public Patient(
        string nome,
        string cpf,
        DateTime dataNascimento,
        string sexo,
        string? telefone,
        string? email,
        string? endereco,
        string? observacoes,
        string? documentos,
        string? historico,
        int? avaliadorId,
        int groupId)
    {
        if (groupId <= 0)
        {
            throw new InvalidOperationException("Grupo invalido.");
        }

        AvaliadorId = avaliadorId;
        GroupId = groupId;
        CriadoEm = DateTime.UtcNow;
        ApplyDetails(nome, cpf, dataNascimento, sexo, telefone, email, endereco, observacoes, documentos, historico);
    }

    public string Nome { get; private set; } = string.Empty;
    public string Cpf { get; private set; } = string.Empty;
    public DateTime DataNascimento { get; private set; }
    public string Sexo { get; private set; } = string.Empty;
    public int? Idade { get; private set; }
    public int? AvaliadorId { get; private set; }
    public string? Telefone { get; private set; }
    public string? Email { get; private set; }
    public string? Endereco { get; private set; }
    public string? Observacoes { get; private set; }
    public string? Documentos { get; private set; }
    public string? Historico { get; private set; }
    public int GroupId { get; private set; }
    public DateTime CriadoEm { get; private set; }

    public User? Avaliador { get; private set; }
    public Group Group { get; private set; } = null!;

    public IReadOnlyCollection<Evaluation> Avaliacoes => _avaliacoes;
    private readonly List<Evaluation> _avaliacoes = [];

    public void UpdateDetails(
        string nome,
        string cpf,
        DateTime dataNascimento,
        string sexo,
        string? telefone,
        string? email,
        string? endereco,
        string? observacoes,
        string? documentos,
        string? historico,
        int groupId)
    {
        if (groupId <= 0)
        {
            throw new InvalidOperationException("Grupo invalido.");
        }

        GroupId = groupId;
        ApplyDetails(nome, cpf, dataNascimento, sexo, telefone, email, endereco, observacoes, documentos, historico);
    }

    private void ApplyDetails(
        string nome,
        string cpf,
        DateTime dataNascimento,
        string sexo,
        string? telefone,
        string? email,
        string? endereco,
        string? observacoes,
        string? documentos,
        string? historico)
    {
        if (string.IsNullOrWhiteSpace(nome))
        {
            throw new InvalidOperationException("Nome do paciente e obrigatorio.");
        }

        var normalizedCpf = NormalizeDigits(cpf);
        if (normalizedCpf.Length != 11)
        {
            throw new InvalidOperationException("CPF do paciente deve conter 11 digitos.");
        }

        var normalizedBirthDate = dataNascimento.Date;
        if (normalizedBirthDate == default)
        {
            throw new InvalidOperationException("Data de nascimento do paciente e obrigatoria.");
        }

        if (normalizedBirthDate > DateTime.UtcNow.Date)
        {
            throw new InvalidOperationException("Data de nascimento do paciente nao pode ser futura.");
        }

        var normalizedSex = (sexo ?? string.Empty).Trim().ToLowerInvariant();
        if (normalizedSex is not ("feminino" or "masculino" or "outro"))
        {
            throw new InvalidOperationException("Sexo do paciente e invalido.");
        }

        var normalizedEmail = NormalizeNullable(email);
        if (normalizedEmail is not null && (!normalizedEmail.Contains('@') || normalizedEmail.StartsWith('@') || normalizedEmail.EndsWith('@')))
        {
            throw new InvalidOperationException("Email do paciente e invalido.");
        }

        Nome = nome.Trim();
        Cpf = normalizedCpf;
        DataNascimento = normalizedBirthDate;
        Sexo = normalizedSex;
        Idade = CalculateAge(normalizedBirthDate);
        Telefone = NormalizeDigitsOrNull(telefone);
        Email = normalizedEmail;
        Endereco = NormalizeNullable(endereco);
        Observacoes = NormalizeNullable(observacoes);
        Documentos = NormalizeNullable(documentos);
        Historico = NormalizeNullable(historico);
    }

    private static int CalculateAge(DateTime birthDate)
    {
        var today = DateTime.UtcNow.Date;
        var age = today.Year - birthDate.Year;
        if (birthDate.Date > today.AddYears(-age))
        {
            age -= 1;
        }

        return Math.Max(age, 0);
    }

    private static string NormalizeDigits(string? value) =>
        new((value ?? string.Empty).Where(char.IsDigit).ToArray());

    private static string? NormalizeDigitsOrNull(string? value)
    {
        var digits = NormalizeDigits(value);
        return string.IsNullOrWhiteSpace(digits) ? null : digits;
    }

    private static string? NormalizeNullable(string? value)
    {
        var normalized = value?.Trim();
        return string.IsNullOrWhiteSpace(normalized) ? null : normalized;
    }
}



