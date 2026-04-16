import type { Patient } from '@/types';
import type { PatientFormValues, PatientSex, PatientUpsertInput } from '../../types';

export const patientSexOptions: { value: PatientSex; label: string }[] = [
  { value: 'nao_informado', label: 'Nao informado' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'outro', label: 'Outro' },
];

export function buildPatientFormValues(patient?: Patient | null): PatientFormValues {
  return {
    nome: patient?.nome ?? '',
    cpf: patient?.cpf ?? '',
    dataNascimento: patient?.data_nascimento ?? '',
    sexo: patient?.sexo ?? 'nao_informado',
    telefone: patient?.telefone ?? '',
    email: patient?.email ?? '',
    endereco: patient?.endereco ?? '',
    observacoes: patient?.observacoes ?? '',
  };
}

export function mapPatientFormToInput(values: PatientFormValues): PatientUpsertInput {
  return {
    nome: values.nome.trim(),
    cpf: unmaskDigits(values.cpf),
    data_nascimento: values.dataNascimento,
    sexo: values.sexo,
    telefone: unmaskDigits(values.telefone),
    email: values.email.trim(),
    endereco: values.endereco.trim(),
    observacoes: values.observacoes.trim(),
  };
}

export function validatePatientForm(values: PatientFormValues): string | null {
  if (!values.nome.trim()) {
    return 'Informe o nome completo do paciente.';
  }

  if (unmaskDigits(values.cpf).length !== 11) {
    return 'Informe um CPF valido com 11 digitos.';
  }

  if (!values.dataNascimento) {
    return 'Informe a data de nascimento.';
  }

  if (!values.sexo) {
    return 'Informe o sexo do paciente.';
  }

  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    return 'Informe um e-mail valido.';
  }

  return null;
}

export function formatPatientSex(value?: string | null): string {
  switch (value) {
    case 'feminino':
      return 'Feminino';
    case 'masculino':
      return 'Masculino';
    case 'outro':
      return 'Outro';
    case 'nao_informado':
    default:
      return 'Nao informado';
  }
}

export function formatDate(value?: string | null): string {
  if (!value) {
    return 'Nao informado';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString('pt-BR');
}

export function formatCpf(value?: string | null): string {
  const digits = unmaskDigits(value);
  if (digits.length !== 11) {
    return value?.trim() || 'Nao informado';
  }

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatPhone(value?: string | null): string {
  const digits = unmaskDigits(value);
  if (!digits) {
    return 'Nao informado';
  }

  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  return value?.trim() || 'Nao informado';
}

export function maskCpfInput(value: string): string {
  const digits = unmaskDigits(value).slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return digits.replace(/(\d{3})(\d+)/, '$1.$2');
  }

  if (digits.length <= 9) {
    return digits.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
  }

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
}

export function maskPhoneInput(value: string): string {
  const digits = unmaskDigits(value).slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return digits.replace(/(\d{2})(\d+)/, '($1) $2');
  }

  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
  }

  return digits.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
}

export function getPatientSearchText(patient: Patient): string {
  return [patient.nome, patient.cpf, patient.email, patient.telefone, patient.group_nome]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function getPatientAgeLabel(patient: Patient): string {
  if (typeof patient.idade === 'number') {
    return `${patient.idade} ano(s)`;
  }

  if (!patient.data_nascimento) {
    return 'Nao informado';
  }

  const birthDate = new Date(patient.data_nascimento);
  if (Number.isNaN(birthDate.getTime())) {
    return 'Nao informado';
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age >= 0 ? `${age} ano(s)` : 'Nao informado';
}

function unmaskDigits(value?: string | null): string {
  return (value ?? '').replace(/\D/g, '');
}
