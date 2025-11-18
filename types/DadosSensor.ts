export type TipoDadoSensor = 'SONO_HORAS' | 'BATIMENTOS_MEDIOS' | 'ATIVIDADE_PASSOS' | 'ATIVIDADE_CALORIAS';

export interface DadosSensorRequest {
    tipoDadoSensor: TipoDadoSensor;
    valor: number;
}

export interface DadosSensorResponse {
    dadoId: number;
    tipoDado: TipoDadoSensor;
    valor: number;
    time: string;
    usuarioId: number;
}
