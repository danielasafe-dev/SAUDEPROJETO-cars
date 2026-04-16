import type { UserRole } from '@/types';

export interface LoginRequest {
  email: string;
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
    chefia_id?: number | null;
    chefia_nome?: string | null;
    criado_em: string;
  };
}
