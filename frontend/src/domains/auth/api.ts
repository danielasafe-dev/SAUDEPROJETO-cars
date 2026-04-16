import { isMockMode, api } from '@/shared/api/client';
import type { LoginRequest, SetPasswordFromInviteRequest, TokenResponse } from './types';

function normalizeLoginResponse(payload: unknown): TokenResponse {
  const res = payload as Record<string, unknown>;
  const rawUser = (res.user ?? res.User ?? {}) as Record<string, unknown>;

  return {
    access_token: String(res.access_token ?? res.AccessToken ?? ''),
    user: {
      id: Number(rawUser.id ?? rawUser.Id ?? 0),
      nome: String(rawUser.nome ?? rawUser.Nome ?? ''),
      email: String(rawUser.email ?? rawUser.Email ?? ''),
      role: String(rawUser.role ?? rawUser.Role ?? '') as TokenResponse['user']['role'],
      ativo: Boolean(rawUser.ativo ?? rawUser.Ativo ?? false),
      criado_em: String(rawUser.criado_em ?? rawUser.criadoEm ?? rawUser.CriadoEm ?? ''),
    },
  };
}

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
    throw new Error('Credenciais inválidas');
  }

  const { data: res } = await api.post('/api/auth/login', data);
  return normalizeLoginResponse(res);
}

export async function setPasswordFromInvite(data: SetPasswordFromInviteRequest) {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 600));

    if (!data.token.trim()) {
      throw new Error('Convite invalido.');
    }

    if (data.password.trim().length < 6) {
      throw new Error('A senha precisa ter pelo menos 6 caracteres.');
    }

    return;
  }

  await api.post('/api/auth/set-password', data);
}
