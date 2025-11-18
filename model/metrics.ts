export interface MetricaBemEstar {
  metricaId: string;
  usuarioId: string;
  fadigaScore: number;
  estresseScore: number;
  recuperacaoScore: number;
  dataCriacao: string;
}

export interface FatigueMetrics {
  stressLevel: number;
  recoveryIndex: number;
  fatigueIndex: number;
  focusTrend: number;
}
