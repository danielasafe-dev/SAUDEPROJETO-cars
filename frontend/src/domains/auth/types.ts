import type { UserRole } from '@/types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SetPasswordFromInviteRequest {
  token: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  user: {
    id: number;
    nome: string;
    email: string;
    role: UserRole;
    ativo: boolean;
    groupIds: number[];
    groupNames: string[];
    criado_em: string;
  };
}
