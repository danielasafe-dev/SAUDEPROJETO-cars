export interface FormQuestion {
  id?: number;
  texto: string;
  peso: number;
  ordem: number;
  ativa?: boolean;
}

export interface Formulario {
  id: number;
  nome: string;
  descricao?: string;
  groupId?: number;
  groupNome?: string;
  criadoPorUsuarioId: number;
  criadoPorNome: string;
  ativo: boolean;
  pesoTotal: number;
  criadoEm: string;
  atualizadoEm: string;
  perguntas: FormQuestion[];
}

export interface CriarFormularioPayload {
  nome: string;
  descricao?: string;
  groupId?: number;
  perguntas: { texto: string; peso: number; ordem: number }[];
}

export interface Grupo {
  id: number;
  nome: string;
}
