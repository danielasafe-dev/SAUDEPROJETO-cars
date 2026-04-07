import type { Patient, Evaluation, User } from '@/types';

export const mockUsers: User[] = [
  { id: 1, nome: 'Administrador', email: 'admin@cars.com', role: 'admin', ativo: true, criado_em: '2024-01-15T10:00:00Z' },
  { id: 2, nome: 'Maria Silva', email: 'maria@cars.com', role: 'avaliador', ativo: true, criado_em: '2024-02-20T10:00:00Z' },
  { id: 3, nome: 'João Santos', email: 'joao@cars.com', role: 'avaliador', ativo: true, criado_em: '2024-03-10T10:00:00Z' },
];

export const mockPatients: Patient[] = [
  { id: 1, nome: 'Lucas Oliveira', idade: 6, avaliador_id: 2, criado_em: '2024-03-01' },
  { id: 2, nome: 'Ana Clara Souza', idade: 4, avaliador_id: 2, criado_em: '2024-03-15' },
  { id: 3, nome: 'Pedro Henrique Lima', idade: 8, avaliador_id: 3, criado_em: '2024-04-01' },
  { id: 4, nome: 'Isabella Rodrigues', idade: 5, avaliador_id: 2, criado_em: '2024-04-10' },
];

export const mockEvaluations: Evaluation[] = [
  { id: 1, patientId: 1, patientNome: 'Lucas Oliveira', avaliadorId: 2, avaliadorNome: 'Maria Silva', scoreTotal: 41, classificacao: 'TEA Grave', dataAvaliacao: '2024-03-20T14:30:00Z', respostas: { 1: 3, 2: 3, 3: 2, 4: 3, 5: 3, 6: 4, 7: 2, 8: 3, 9: 2, 10: 3, 11: 3, 12: 3, 13: 3, 14: 3 } },
  { id: 2, patientId: 2, patientNome: 'Ana Clara Souza', avaliadorId: 2, avaliadorNome: 'Maria Silva', scoreTotal: 28, classificacao: 'Sem indicativo de TEA', dataAvaliacao: '2024-03-25T10:00:00Z', respostas: { 1: 2, 2: 2, 3: 2, 4: 1, 5: 2, 6: 2, 7: 1, 8: 2, 9: 2, 10: 3, 11: 2, 12: 2, 13: 2, 14: 2 } },
  { id: 3, patientId: 3, patientNome: 'Pedro Henrique Lima', avaliadorId: 3, avaliadorNome: 'João Santos', scoreTotal: 36, classificacao: 'TEA Leve a Moderado', dataAvaliacao: '2024-04-02T16:00:00Z', respostas: { 1: 2, 2: 2, 3: 3, 4: 2, 5: 2, 6: 3, 7: 2, 8: 2, 9: 3, 10: 3, 11: 3, 12: 2, 13: 3, 14: 2 } },
  { id: 4, patientId: 4, patientNome: 'Isabella Rodrigues', avaliadorId: 2, avaliadorNome: 'Maria Silva', scoreTotal: 18, classificacao: 'Sem indicativo de TEA', dataAvaliacao: '2024-04-12T09:30:00Z', respostas: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1, 10: 2, 11: 1, 12: 1, 13: 2, 14: 1 } },
];
