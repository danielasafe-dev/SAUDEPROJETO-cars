import type { Patient } from '@/types';

export type { Patient };

export interface PatientCreate {
  nome: string;
  idade?: number;
}
