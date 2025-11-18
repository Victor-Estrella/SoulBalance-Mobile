import { Recommendation, Recomendacao } from './recommendation';

export function mapRecomendacaoToRecommendation(r: Recomendacao): Recommendation {
  return {
    id: r.recomendacaoId,
    userId: r.usuarioId,
    message: r.sugestao,
    category: 'health',
    createdAt: r.time,
    score: 50,
    origin: 'backend',
    metricaId: r.metricaId,
  };
}
