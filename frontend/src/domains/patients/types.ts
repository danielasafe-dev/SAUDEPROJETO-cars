import type { Patient } from '@/types';

export type { Patient };

export type PatientSex = 'masculino' | 'feminino' | 'outro' | 'nao_informado';

export interface PatientFormValues {
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: PatientSex;
  telefone: string;
  email: string;
  endereco: string;
  observacoes: string;
}

export interface PatientUpsertInput {
  nome: string;
  cpf: string;
  data_nascimento: string;
  sexo: PatientSex;
  telefone?: string;
  email?: string;
  endereco?: string;
  observacoes?: string;
}
