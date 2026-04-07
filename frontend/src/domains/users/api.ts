import { isMockMode, api } from '@/shared/api/client';
import { mockUsers } from '@/shared/api/mockData';

export async function getUsers() {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    return mockUsers;
  }
  return (await api.get('/api/users')).data;
}

export async function createUser(data: {
  nome: string;
  email: string;
  role: 'admin' | 'avaliador';
}) {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    const u = {
      id: Date.now(),
      ...data,
      ativo: true,
      criado_em: new Date().toISOString(),
    };
    mockUsers.push(u);
    return u;
  }
  return (await api.post('/api/auth/register', data)).data;
}

export async function deactivateUser(id: number) {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    const user = mockUsers.find((u) => u.id === id);
    if (user) user.ativo = false;
    return;
  }
  await api.put(`/api/users/${id}/deactivate`);
}
