export type TipoAtividade = 'TRABALHO_FOCO' | 'TRABALHO_CRIATIVO' | 'ESTUDO_APRENDIZADO' | 'PAUSA_ATIVA' | 'DESCANSO_PASSIVO' | 'LAZER_SOCIAL' | 'MEDITACAO_MINDFULNESS' | 'EXERCICIO_FISICO';

export interface AtividadeRequest {
    tipoAtividade: TipoAtividade;
    inicio: string;
    fim: string;    
    descricao: string;
}

export interface AtividadeResponse {
    atividadeId: number;
    tipoAtividade: TipoAtividade;
    inicio: string;
    fim: string;
    duracaoMinutosAtividade: number;
    usuarioId: number;
    descricao: string;
}
