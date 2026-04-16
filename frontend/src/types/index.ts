// Shared domain types
export type UserRole = 'admin' | 'analista' | 'agente_saude' | 'gestor';

export interface User {
  id: number;
  nome: string;
  email: string;
  role: UserRole;
  ativo: boolean;
  criado_em: string;
}

export interface Patient {
  id: number;
  nome: string;
  idade: number | null;
  avaliador_id: number | null;
  cpf?: string | null;
  data_nascimento?: string | null;
  sexo?: 'masculino' | 'feminino' | 'outro' | 'nao_informado' | null;
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
  observacoes?: string | null;
  group_id?: number | null;
  group_nome?: string | null;
  criado_em: string;
}

export interface Evaluation {
  id: number;
  patientId: number;
  patientNome: string;
  avaliadorId: number;
  avaliadorNome: string;
  respostas: Record<number, number>;
  scoreTotal: number;
  classificacao: string;
  dataAvaliacao: string;
}

export interface DashboardStats {
  total: number;
  averageScore: number;
  lastMonthEvaluations: number;
  classificationDistribution: {
    semIndicativo: number;
    teaLeveModerado: number;
    teaGrave: number;
  };
  recentEvaluations: Evaluation[];
}
