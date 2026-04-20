import { isMockMode, api } from '@/shared/api/client';
import { mockPatients } from '@/shared/api/mockData';
import type { Evaluation, Patient } from '@/types';
import { getEvals } from '@/domains/dashboard/api';
import type { PatientUpsertInput } from './types';

export type CreatePatientInput = PatientUpsertInput;
export type UpdatePatientInput = PatientUpsertInput;

export async function getPatients(): Promise<Patient[]> {
  if (isMockMode()) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockPatients.map(normalizePatient);
  }

  const { data } = await api.get('/api/patients');
  return Array.isArray(data) ? data.map(normalizePatient) : [];
}

export async function createPatient(data: CreatePatientInput): Promise<Patient> {
  if (isMockMode()) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const created = normalizePatient({
      id: Date.now(),
      nome: data.nome,
      cpf: data.cpf,
      data_nascimento: data.data_nascimento,
      sexo: data.sexo,
      telefone: data.telefone || null,
      email: data.email || null,
      endereco: data.endereco || null,
      observacoes: data.observacoes || null,
      documentos: data.documentos || null,
      historico: data.historico || null,
      idade: calculateAge(data.data_nascimento),
      avaliador_id: 2,
      group_id: 1,
      group_nome: 'Grupo Padrao',
      criado_em: new Date().toISOString(),
    });

    mockPatients.push(created);
    return created;
  }

  const response = await api.post('/api/patients', data);
  return normalizePatient(response.data);
}

export async function updatePatient(id: number, data: UpdatePatientInput): Promise<Patient> {
  if (isMockMode()) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const patient = mockPatients.find((item) => item.id === id);
    if (!patient) {
      throw new Error('Paciente nao encontrado.');
    }

    patient.nome = data.nome;
    patient.cpf = data.cpf;
    patient.data_nascimento = data.data_nascimento;
    patient.sexo = data.sexo;
    patient.telefone = data.telefone || null;
    patient.email = data.email || null;
    patient.endereco = data.endereco || null;
    patient.observacoes = data.observacoes || null;
    patient.documentos = data.documentos || null;
    patient.historico = data.historico || null;
    patient.idade = calculateAge(data.data_nascimento);
    return normalizePatient(patient);
  }

  const response = await api.put(`/api/patients/${id}`, data);
  return normalizePatient(response.data);
}

export async function deletePatient(id: number): Promise<void> {
  if (isMockMode()) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = mockPatients.findIndex((item) => item.id === id);
    if (index >= 0) {
      mockPatients.splice(index, 1);
    }
    return;
  }

  throw new Error('A API atual ainda nao suporta a exclusao de pacientes neste ambiente.');
}

export async function getPatientEvaluations(patientId: number): Promise<Evaluation[]> {
  const evaluations = await getEvals();
  return evaluations.filter((item) => Number(item.patientId) === patientId);
}

function normalizePatient(payload: unknown): Patient {
  const raw = payload as Record<string, unknown>;
  const birthDate = raw.data_nascimento ?? raw.dataNascimento ?? null;
  const rawSex = asNullableString(raw.sexo ?? raw.Sexo);
  const sexo = rawSex === 'feminino' || rawSex === 'masculino' || rawSex === 'outro' ? rawSex : null;

  return {
    id: Number(raw.id ?? raw.Id ?? 0),
    nome: String(raw.nome ?? raw.Nome ?? ''),
    idade: resolveNullableNumber(raw.idade ?? raw.Idade, calculateAge(asNullableString(birthDate))),
    avaliador_id: resolveNullableNumber(raw.avaliador_id ?? raw.avaliadorId ?? raw.AvaliadorId),
    cpf: asNullableString(raw.cpf ?? raw.Cpf),
    data_nascimento: asNullableString(birthDate),
    sexo,
    telefone: asNullableString(raw.telefone ?? raw.Telefone),
    email: asNullableString(raw.email ?? raw.Email),
    endereco: asNullableString(raw.endereco ?? raw.Endereco),
    observacoes: asNullableString(raw.observacoes ?? raw.Observacoes),
    documentos: asNullableString(raw.documentos ?? raw.Documentos),
    historico: asNullableString(raw.historico ?? raw.Historico),
    group_id: resolveNullableNumber(raw.group_id ?? raw.groupId ?? raw.GroupId),
    group_nome: asNullableString(raw.group_nome ?? raw.groupNome ?? raw.GroupNome),
    criado_em: String(raw.criado_em ?? raw.criadoEm ?? raw.CriadoEm ?? new Date().toISOString()),
  };
}

function calculateAge(value?: string | null): number | null {
  if (!value) {
    return null;
  }

  const birthDate = new Date(value);
  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function asNullableString(value: unknown): string | null {
  if (value == null) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized ? normalized : null;
}

function resolveNullableNumber(value: unknown, fallback: number | null = null): number | null {
  if (value == null || value === '') {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
