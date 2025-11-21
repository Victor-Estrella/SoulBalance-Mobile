export interface AiRequestPayload {
    recoveryStatus: number; // 0-10
    perceivedFatigue: number; // 0-10
    focusLevel: number; // 0-10
    sleepHours: number; // últimas horas de sono
    mainTask: string; // descrição da tarefa principal
}

export interface AiAdjustmentResponse {
    diagnostico: string;
    ajusteCarga?: string;
    recomendacoesAutocuidado: string[];
    planoDia?: { titulo: string; duracaoMin?: number; tipo: string; detalhes?: string }[];
    rawText?: string;
    retries?: number;
    error?: string;
}

