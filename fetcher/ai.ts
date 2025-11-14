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
  retries?: number;
  error?: string;
}

// Base URL fixo para a API da IA (ajuste para o seu domínio da Vercel, se necessário)
const BASE_URL = 'https://soul-balance-python.vercel.app';
// O endpoint na Vercel pode levar >30s em cold start;
// aumentamos o timeout do cliente para evitar AbortError prematuro.
const TIMEOUT_MS = 60000;

export async function postAjusteIA(payload: AiRequestPayload): Promise<AiAdjustmentResponse> {
  const endpoint = `${BASE_URL}/api/ai/ajuste`;
  let lastError: any;
  const maxRetries = 2;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const to = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const started = Date.now();
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(to);
      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} :: ${errBody.slice(0, 280)}`);
      }
      const contentType = (res.headers.get('content-type') || '').toLowerCase();
      if (contentType.includes('application/json')) {
        try {
          const json = await res.json();
          return { ...json, retries: attempt };
        } catch (e) {
          // continua para parse texto
        }
      }
      const text = await res.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return { ...parsed, rawText: text, retries: attempt };
        } catch {/* ignore */}
      }
      const lines = text.split(/\r?\n|•|\*/).map(s => s.trim()).filter(Boolean);
      const firstLine = lines[0] || 'Resultado de IA em texto livre.';
      const diagnostico = firstLine.replace(/^diagnóstico[:\-]\s*/i, '');
      const suggestionVerbs = /^(faça|pausa|respiração|alongamento|hidrate|caminhe|medite|planeje|descanse|evite|reduza|aumente|organize)/i;
      const recomendacoesAutocuidado = lines.slice(1).filter(l => suggestionVerbs.test(l) || /\d+\s?m(in)?/i.test(l)).slice(0, 5);
      let ajusteCarga: string | undefined;
      if (/\breduz|\bdiminu|\baument|\beleve/i.test(text)) {
        const m = text.match(/(reduz\w+|diminu\w+|aument\w+|eleve)[^\.!?]{0,80}/i);
        if (m) ajusteCarga = m[0].trim();
      }
      return { diagnostico, ajusteCarga, recomendacoesAutocuidado, rawText: text, retries: attempt };
    } catch (e: any) {
      clearTimeout(to);
      lastError = e;
      const elapsed = Date.now() - started;
      const isAbort = e?.name === 'AbortError';
      const isServerProbable = /HTTP 5|HTTP 4(0|3|4|9)/.test(String(e?.message));
      const shouldRetry = attempt < maxRetries && (isAbort || isServerProbable);
      console.warn(`[AI Fetch Attempt ${attempt} Failed]`, e?.message, `elapsed=${elapsed}ms retry=${shouldRetry}`);
      if (!shouldRetry) break;
      await new Promise(r => setTimeout(r, 800 * (attempt + 1))); // backoff simples
    }
  }
  return {
    diagnostico: 'Falha na comunicação com IA (limite de tentativas).',
    recomendacoesAutocuidado: ['Respiração leve 5m', 'Alongamento rápido'],
    rawText: String(lastError?.message || lastError),
    retries: 2,
    error: String(lastError?.stack || lastError?.message || lastError)
  };
}
