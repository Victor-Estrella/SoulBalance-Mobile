import { DailyPlan, DailyPlanItem, GenerativeInterpretation, NarrativeReport, WellbeingEntry, Recommendation } from '../model/types';
import { uid } from '../utils/validators';

export function interpretState(entries: WellbeingEntry[]): GenerativeInterpretation {
  const latest = entries[0];
  if (!latest) return { status_curto: 'estável', competencias: [], mensagem: 'Faça seu primeiro check-in para começarmos.' };
  const score = latest.mood + latest.energy + latest.focus; // 3..15
  if (score <= 6) return { status_curto: 'em alerta', competencias: ['autoconsciência'], mensagem: 'Notei sinais de cansaço. Vamos priorizar pausas e respiração leve hoje.' };
  if (score <= 9) return { status_curto: 'em recuperação', competencias: ['resiliência'], mensagem: 'Você está se recompondo. Sequências curtas de foco podem ajudar.' };
  if (score >= 13) return { status_curto: 'em alta', competencias: ['consistência','autogestão'], mensagem: 'Excelente momento! Aproveite para avançar uma micro-missão importante.' };
  return { status_curto: 'estável', competencias: ['equilíbrio'], mensagem: 'Bom ritmo. Mantenha alternância entre foco e pausas.' };
}

export function generateDailyPlan(entries: WellbeingEntry[]): DailyPlan {
  const items: DailyPlanItem[] = [];
  const latest = entries[0];
  const today = new Date().toISOString().slice(0,10);
  if (!latest) {
    items.push({ id: uid(), tipo: 'mensagem', titulo: 'Bem-vindo!', detalhes: 'Faça um check-in para personalizar seu plano.' });
  } else if (latest.energy <= 2) {
    items.push({ id: uid(), tipo: 'pausa', titulo: 'Pausa ativa 5m', detalhes: 'Respiração 4-7-8 ou alongamento leve', duracaoMin: 5 });
    items.push({ id: uid(), tipo: 'micro-missao', titulo: 'Micro-missão 15m', detalhes: 'Tarefa simples com contexto claro', duracaoMin: 15 });
  } else if (latest.focus >= 4) {
    items.push({ id: uid(), tipo: 'micro-missao', titulo: 'Deep Focus 40m', detalhes: 'Bloco de foco profundo', duracaoMin: 40 });
    items.push({ id: uid(), tipo: 'pausa', titulo: 'Recuperação 10m', detalhes: 'Hidratar e caminhar', duracaoMin: 10 });
  } else {
    items.push({ id: uid(), tipo: 'planejamento', titulo: 'Planejar o dia 10m', detalhes: 'Defina 1-3 prioridades', duracaoMin: 10 });
  }
  return { dataISO: today, itens: items };
}

export function generateNarrative(entries: WellbeingEntry[]): NarrativeReport {
  const periodo: NarrativeReport['periodo'] = 'semanal';
  const resumo = 'Você manteve um bom equilíbrio entre esforço e recuperação. Houve melhora gradual no foco.';
  return { periodo, resumo };
}

export function aiRecommendations(entries: WellbeingEntry[]): Recommendation[] {
  const interp = interpretState(entries);
  const recs: Omit<Recommendation, 'id' | 'userId' | 'createdAt'>[] = [];
  if (interp.status_curto === 'em alerta') {
    recs.push({ category: 'rest', message: 'Intervalo guiado de respiração 5m.', score: 0.95 });
  }
  if (interp.status_curto === 'em alta') {
    recs.push({ category: 'productivity', message: 'Aproveite para um bloco de foco profundo.', score: 0.8 });
  }
  return recs.map(r => ({ ...r, id: uid(), userId: 'ai', createdAt: new Date().toISOString() }));
}
