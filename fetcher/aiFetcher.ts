import axios from 'axios';
import { AiAdjustmentResponse, AiRequestPayload } from '../types/IA';

const BASE_URL = 'https://soul-balance-python.vercel.app';
const TIMEOUT_MS = 60000;

export async function postAjusteIA(payload: AiRequestPayload): Promise<AiAdjustmentResponse> {
  const endpoint = `${BASE_URL}/api/ai/ajuste`;
  let lastError: any;
  const maxRetries = 2;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await axios.post(endpoint, payload, {
        timeout: TIMEOUT_MS,
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true
      });
      if (res.status < 200 || res.status >= 300) {
        throw new Error(`HTTP ${res.status} :: ${typeof res.data === 'string' ? res.data.slice(0, 280) : JSON.stringify(res.data).slice(0, 280)}`);
      }
      if (typeof res.data === 'object') {
        return { ...res.data, retries: attempt };
      }
      const text = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
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
      lastError = e;
      const isServerProbable = /HTTP 5|HTTP 4(0|3|4|9)/.test(String(e?.message));
      const shouldRetry = attempt < maxRetries && isServerProbable;
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
