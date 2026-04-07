import { isMockMode, api } from '@/shared/api/client';
import { mockPatients } from '@/shared/api/mockData';

export async function getPatients() {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    return mockPatients;
  }
  return (await api.get('/api/patients')).data;
}

export async function createPatient(data: { nome: string; idade?: number }) {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    const newP = {
      id: Date.now(),
      nome: data.nome,
      idade: data.idade ?? null,
      avaliador_id: 2,
      criado_em: new Date().toISOString().split('T')[0],
    };
    mockPatients.push(newP);
    return newP;
  }
  return (await api.post('/api/patients', data)).data;
}
