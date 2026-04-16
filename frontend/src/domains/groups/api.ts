import { api, isMockMode } from '@/shared/api/client';
import { mockGroups } from '@/shared/api/mockData';
import type { User } from '@/types';
import type { Group, GroupUpsertInput } from './types';

export type CreateGroupInput = GroupUpsertInput;
export type UpdateGroupInput = GroupUpsertInput;

export async function getGroups(): Promise<Group[]> {
  if (isMockMode()) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockGroups.map(normalizeGroup);
  }

  const { data } = await api.get('/api/groups');
  return Array.isArray(data) ? data.map(normalizeGroup) : [];
}

export async function createGroup(data: CreateGroupInput, manager?: User | null): Promise<Group> {
  if (isMockMode()) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const created = normalizeGroup({
      id: Date.now(),
      nome: data.nome,
      gestor_id: data.gestorId ?? manager?.id ?? null,
      gestor_nome: manager?.nome ?? null,
      ativo: true,
      quantidade_membros: 0,
      criado_em: new Date().toISOString(),
    });

    mockGroups.push(created);
    return created;
  }

  const payload = {
    nome: data.nome,
    gestorId: data.gestorId ?? undefined,
  };

  const { data: created } = await api.post('/api/groups', payload);
  return normalizeGroup(created);
}

export async function updateGroup(id: number, data: UpdateGroupInput, manager?: User | null): Promise<Group> {
  if (isMockMode()) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const group = mockGroups.find((item) => Number((item as Group).id) === id);
    if (!group) {
      throw new Error('Grupo nao encontrado.');
    }

    const normalized = group as Group;
    normalized.nome = data.nome;
    normalized.gestor_id = data.gestorId ?? manager?.id ?? null;
    normalized.gestor_nome = manager?.nome ?? null;
    return normalizeGroup(normalized);
  }

  const payload = {
    nome: data.nome,
    gestorId: data.gestorId ?? undefined,
  };

  const { data: updated } = await api.put(`/api/groups/${id}`, payload);
  return normalizeGroup(updated);
}

export async function deleteGroup(id: number): Promise<void> {
  if (isMockMode()) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockGroups.findIndex((item) => Number((item as Group).id) === id);
    if (index >= 0) {
      mockGroups.splice(index, 1);
    }
    return;
  }

  await api.delete(`/api/groups/${id}`);
}

function normalizeGroup(payload: unknown): Group {
  const raw = payload as Record<string, unknown>;

  return {
    id: Number(raw.id ?? raw.Id ?? 0),
    nome: String(raw.nome ?? raw.Nome ?? ''),
    gestor_id: resolveNullableNumber(raw.gestor_id ?? raw.gestorId ?? raw.GestorId),
    gestor_nome: asNullableString(raw.gestor_nome ?? raw.gestorNome ?? raw.GestorNome),
    ativo: Boolean(raw.ativo ?? raw.Ativo ?? false),
    quantidade_membros: Number(raw.quantidade_membros ?? raw.quantidadeMembros ?? raw.QuantidadeMembros ?? 0),
    criado_em: String(raw.criado_em ?? raw.criadoEm ?? raw.CriadoEm ?? new Date().toISOString()),
  };
}

function asNullableString(value: unknown): string | null {
  if (value == null) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized ? normalized : null;
}

function resolveNullableNumber(value: unknown): number | null {
  if (value == null || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
