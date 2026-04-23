import type { Group } from '../types';

export const ADMIN_DEFAULT_GROUP_NAME = 'Grupo Padrao';

export function isAdminDefaultGroup(group: Pick<Group, 'nome'>): boolean {
  return group.nome.trim().toLowerCase() === ADMIN_DEFAULT_GROUP_NAME.toLowerCase();
}
