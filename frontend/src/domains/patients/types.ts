import type { Patient } from '@/types';

export type { Patient };

export type PatientSex = 'masculino' | 'feminino' | 'outro';
export type PatientFormSex = '' | PatientSex;
export type PatientSearchField = 'all' | 'nome' | 'cpf' | 'sexo' | 'data_nascimento';

export interface PatientFormValues {
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: PatientFormSex;
  groupId: string;
  telefone: string;
  email: string;
  endereco: string;
  observacoes: string;
  documentos: string;
  historico: string;
}

export interface PatientUpsertInput {
  nome: string;
  cpf: string;
  data_nascimento: string;
  sexo: PatientSex;
  groupId?: number;
  telefone?: string;
  email?: string;
  endereco?: string;
  observacoes?: string;
  documentos?: string;
  historico?: string;
}
