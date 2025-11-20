export type ValorEnum = 'MUITO_BAIXO' | 'BAIXO' | 'MEDIO' | 'ALTO' | 'MUITO_ALTO';

export interface CheckinManualRequest {
    humor: ValorEnum;
    energia: ValorEnum;
    foco: ValorEnum;
}

export interface CheckinManualResponse {
    chekinId: number;
    humor: ValorEnum;
    energia: ValorEnum;
    foco: ValorEnum;
    time: string;
    usuarioId: number;
}
