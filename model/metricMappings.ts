import { FatigueMetrics, MetricaBemEstar } from './metrics';
import { uid } from '../utils/validators';

export function mapFatigueToMetrica(usuarioId: string, metrics: FatigueMetrics): MetricaBemEstar {
  return {
    metricaId: uid(),
    usuarioId,
    fadigaScore: metrics.fatigueIndex,
    estresseScore: metrics.stressLevel,
    recuperacaoScore: metrics.recoveryIndex,
    dataCriacao: new Date().toISOString(),
  };
}
