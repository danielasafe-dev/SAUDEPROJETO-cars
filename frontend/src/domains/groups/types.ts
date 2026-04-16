export interface Group {
  id: number;
  nome: string;
  gestor_id: number | null;
  gestor_nome: string | null;
  ativo: boolean;
  quantidade_membros: number;
  criado_em: string;
}

export interface GroupFormValues {
  nome: string;
  gestorId: string;
}

export interface GroupUpsertInput {
  nome: string;
  gestorId?: number | null;
}
