export enum TipoAtividade {
  CREATIVE = 'CREATIVE',
  SOFTSKILL = 'SOFTSKILL',
  DEEPWORK = 'DEEPWORK',
  LEARNING = 'LEARNING',
}

export interface Atividade {
  atividadeId: string;
  usuarioId: string;
  tipoAtividade: TipoAtividade;
  inicio: string;
  fim: string;
  duracaoMinutosAtividade: number;
}

export interface RegistroTrabalho {
  id: string;
  userId: string;
  task: string;
  durationMinutes: number;
  type: TipoAtividade;
  createdAt: string;
}
