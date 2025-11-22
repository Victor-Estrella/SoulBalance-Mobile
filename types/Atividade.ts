export interface AtividadeRequest {
    tipoAtividade: TipoAtividade;
    inicio: string; // ISO string
    fim: string;    // ISO string
    descricao: string;
    email: string;
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
