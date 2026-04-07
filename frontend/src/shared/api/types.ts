export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

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

export interface PatientCreate {
  nome: string;
  idade?: number;
}

export interface EvaluationCreate {
  patient_id: number;
  respostas: Record<number, number>;
}
