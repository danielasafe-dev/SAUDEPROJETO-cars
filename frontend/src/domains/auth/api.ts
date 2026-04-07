import { isMockMode, api } from '@/shared/api/client';
import type { LoginRequest, TokenResponse } from './types';

export async function loginReq(data: LoginRequest): Promise<TokenResponse> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 600));
    if (data.password === 'admin123') {
      return {
        access_token: 'mock-jwt-token',
        user: {
          id: 1,
          nome: 'Administrador',
          email: data.email,
          role: 'admin',
          ativo: true,
          criado_em: new Date().toISOString(),
        },
      };
    }
    if (data.password === 'avaliador123') {
      return {
        access_token: 'mock-jwt-token',
        user: {
          id: 2,
          nome: 'Maria Avaliadora',
          email: data.email,
          role: 'avaliador',
          ativo: true,
          criado_em: new Date().toISOString(),
        },
      };
    }
    throw new Error('Credenciais inválidas');
  }

  const { data: res } = await api.post<TokenResponse>('/api/auth/login', data);
  return res;
}
