import { isMockMode, api } from '@/shared/api/client';
import { mockUsers } from '@/shared/api/mockData';
import type { UserRole, User } from '@/types';

export interface CreateUserInput {
  nome: string;
  email: string;
  role: UserRole;
  chefiaId?: number | null;
}

export interface UpdateUserInput {
  nome: string;
  email: string;
  role: UserRole;
}

export async function getUsers() {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    return mockUsers;
  }
  return (await api.get('/api/users')).data;
}

export async function createUser(data: CreateUserInput) {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    const normalizedChefiaId = data.chefiaId && data.chefiaId > 0 ? data.chefiaId : null;
    const linkedLeadership = normalizedChefiaId
      ? mockUsers.find((user) => user.id === normalizedChefiaId && user.role === 'chefia' && user.ativo)
      : null;

    if (data.role === 'admin' && normalizedChefiaId) {
      throw new Error('Administrador nao pode ter chefia vinculada.');
    }

    if (data.role !== 'admin' && data.role !== 'chefia' && !normalizedChefiaId) {
      throw new Error('Usuarios deste perfil precisam de chefia vinculada.');
    }

    if (normalizedChefiaId && !linkedLeadership) {
      throw new Error('Chefia vinculada precisa ser um usuario ativo com perfil Chefia.');
    }

    const u = {
      id: Date.now(),
      nome: data.nome,
      email: data.email,
      role: data.role,
      ativo: true,
      chefia_id: linkedLeadership?.id ?? null,
      chefia_nome: linkedLeadership?.nome ?? null,
      criado_em: new Date().toISOString(),
    } satisfies User;
    mockUsers.push(u);
    return u;
  }
  return (await api.post('/api/auth/register', data)).data;
}

export async function updateUser(id: number, data: UpdateUserInput) {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error('Usuario nao encontrado');
    }

    user.nome = data.nome;
    user.email = data.email;
    user.role = data.role;
    return user;
  }

  throw new Error('Edicao de usuario ainda nao esta disponivel neste ambiente.');
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
