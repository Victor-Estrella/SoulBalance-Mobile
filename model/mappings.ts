import { FatigueMetrics, MetricaBemEstar, PerfilEvolutivo, Recommendation, Recomendacao, ValorEnun } from './types';
import { uid } from '../utils/validators';

// Map internal fatigue metrics to backend metric entity
export function mapFatigueToMetrica(usuarioId: string, metrics: FatigueMetrics): MetricaBemEstar {
  return {
    metricaId: uid(),
    usuarioId,
    fadigaScore: metrics.fatigueIndex,
    estresseScore: metrics.stressLevel,
    recuperacaoScore: metrics.recoveryIndex,
    dataCriacao: new Date().toISOString()
  };
}

// Map backend recommendation entity to internal enriched recommendation
export function mapRecomendacaoToRecommendation(r: Recomendacao): Recommendation {
  return {
    id: r.recomendacaoId,
    userId: r.usuarioId,
    message: r.sugestao,
    category: 'health', // default until backend categorization available
    createdAt: r.time,
    score: 50, // placeholder relevance score
    origin: 'backend',
    metricaId: r.metricaId
  };
}

// Convert numeric scale (1-5) to ValorEnun heuristic
export function scaleToValorEnun(value: number): ValorEnun {
  if (value <= 1) return ValorEnun.PESSIMO;
  if (value === 2) return ValorEnun.RUIM;
  if (value === 3) return ValorEnun.REGULAR;
  if (value === 4) return ValorEnun.BOM;
  return ValorEnun.OTIMO;
}

// Map internal wellbeing entry (which already stores ValorEnun) to a manual checkin payload for backend
// wellbeingEntry mapping removed until semantic scale migration is reintroduced

// Parse PerfilEvolutivo jsonCompetencias string
export function parsePerfilCompetencias(jsonCompetencias: string | null | undefined): string[] {
  if (!jsonCompetencias) return [];
  try {
    const parsed = JSON.parse(jsonCompetencias);
    return Array.isArray(parsed) ? parsed.filter(x => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

// Build PerfilEvolutivo from raw backend response
export function buildPerfilEvolutivo(raw: any): PerfilEvolutivo {
  return {
    perfilId: String(raw.perfil_id ?? uid()),
    usuarioId: String(raw.fk_id_usuario ?? raw.usuarioId ?? ''),
    ptoAutocuidado: Number(raw.pto_autocuidado ?? 0),
    ptoResiliencia: Number(raw.pto_resiliencia ?? 0),
    dataLastUpdate: raw.data_last_update ?? new Date().toISOString(),
    statusCurto: raw.status_curto ?? raw.statusCurto ?? '',
    competencias: parsePerfilCompetencias(raw.json_competencias)
  };
}
