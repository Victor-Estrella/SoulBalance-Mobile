// O tipo TipoAtividade agora é importado do model/atividade.ts como enum

export interface AtividadeRequest {
    tipoAtividade: TipoAtividade;
    descricao: string;
    durationMinutes: number;
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
