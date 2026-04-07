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
    role: 'admin' | 'avaliador';
    ativo: boolean;
    criado_em: string;
  };
}
