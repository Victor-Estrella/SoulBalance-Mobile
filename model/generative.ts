export interface GenerativeInterpretation {
  status_curto: 'em alta' | 'em recuperação' | 'estável' | 'em alerta';
  competencias: string[];
  mensagem: string;
}

export interface DailyPlanItem {
  id: string;
  tipo: 'pausa' | 'micro-missao' | 'meditacao' | 'mensagem' | 'planejamento';
  titulo: string;
  detalhes?: string;
  duracaoMin?: number;
}

export interface DailyPlan {
  dataISO: string;
  itens: DailyPlanItem[];
}

export interface NarrativeReport {
  periodo: 'diario' | 'semanal';
  resumo: string;
}

export interface ProfileSnapshot {
  updatedAt: string;
  interpretation: GenerativeInterpretation;
}
