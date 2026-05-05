export interface FormQuestion {
  id?: string;
  texto: string;
  peso: number;
  ordem: number;
  ativa?: boolean;
}

export interface Formulario {
  id: string;
  nome: string;
  descricao?: string;
  groupId?: string;
  groupNome?: string;
  criadoPorUsuarioId: string;
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
  groupId?: string;
  perguntas: { texto: string; peso: number; ordem: number }[];
}

export interface Grupo {
  id: string;
  nome: string;
}
