import type { UserRole } from '@/types';

export const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Administrador' },
  { value: 'gestor', label: 'Gestor' },
  { value: 'chefia', label: 'Chefia' },
  { value: 'agente_saude', label: 'Agente de Saude' },
  { value: 'analista', label: 'Analista' },
];

export function formatRole(role: string): string {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'gestor':
      return 'Gestor';
    case 'chefia':
      return 'Chefia';
    case 'agente_saude':
      return 'Agente de Saude';
    case 'analista':
      return 'Analista';
    default:
      return role;
  }
}

export function shouldShowLinkedLeadershipField(role: UserRole): boolean {
  return role !== 'admin';
}

export function isLinkedLeadershipRequired(role: UserRole): boolean {
  return role !== 'admin' && role !== 'chefia';
}

export function roleBadgeCls(role: string): string {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-700';
    case 'gestor':
      return 'bg-orange-100 text-orange-700';
    case 'chefia':
      return 'bg-amber-100 text-amber-700';
    case 'agente_saude':
      return 'bg-blue-100 text-blue-700';
    case 'analista':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export function statusBadgeCls(active: boolean): string {
  return active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
}

export function formatCreatedAt(value: string): string {
  return new Date(value).toLocaleDateString('pt-BR');
}
