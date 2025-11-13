// Fetcher layer: only network calls related to AI backend
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
}

const BASE_URL = (process.env.EXPO_PUBLIC_AI_API_BASE_URL as string)
  || 'https://soul-balance-python.vercel.app/api/ai';
const TIMEOUT_MS = 12000;

export async function postAjusteIA(payload: AiRequestPayload): Promise<AiAdjustmentResponse> {
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}/ajuste`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(to);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // Espera JSON já do backend; se não for JSON, tenta texto como fallback
    const text = await res.text();
    try { return JSON.parse(text); } catch {
      return { diagnostico: 'Texto livre recebido.', recomendacoesAutocuidado: [], rawText: text };
    }
  } catch (e: any) {
    clearTimeout(to);
    return {
      diagnostico: 'Falha na comunicação com IA.',
      recomendacoesAutocuidado: ['Respiração leve 5m', 'Alongamento rápido'],
      rawText: String(e?.message || e)
    };
  }
}
