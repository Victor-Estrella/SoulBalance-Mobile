export interface Recomendacao {
  recomendacaoId: string;
  usuarioId: string;
  sugestao: string;
  time: string;
  metricaId?: string;
}

export interface Recommendation {
  id: string;
  userId: string;
  message: string;
  category: 'rest' | 'focus' | 'health' | 'learning' | 'productivity';
  createdAt: string;
  score: number;
  origin?: 'ai' | 'rule' | 'backend';
  metricaId?: string;
}
