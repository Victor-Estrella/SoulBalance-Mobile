export enum TipoAtividade {
  EXERCICIO_FISICO = 'EXERCICIO_FISICO',
  TRABALHO_CRIATIVO = 'TRABALHO_CRIATIVO',
  PAUSA_ATIVA = 'PAUSA_ATIVA',
  LAZER_SOCIAL = 'LAZER_SOCIAL',
  DESCANSO_PASSIVO = 'DESCANSO_PASSIVO',
  ESTUDO_APRENDIZADO = 'ESTUDO_APRENDIZADO',
  TRABALHO_FOCO = 'TRABALHO_FOCO',
  MEDITACAO_MINDFULNESS = 'MEDITACAO_MINDFULNESS',
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
