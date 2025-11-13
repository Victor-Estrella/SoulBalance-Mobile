import { Recommendation, WellbeingEntry, FatigueMetrics } from '../model/types';
import { aiRecommendations } from './aiCoachService';
import { uid } from '../utils/validators';

type BareRec = Omit<Recommendation, 'id' | 'userId' | 'createdAt'>;

export function buildRecommendations(userId: string, entries: WellbeingEntry[], metrics: FatigueMetrics): Recommendation[] {
  const list: BareRec[] = [];
  if (metrics.fatigueIndex > 60) {
    list.push(msg('rest', 'Reduza duração das tarefas e faça uma pausa breve.', 0.9));
  } else if (metrics.recoveryIndex > 70) {
    list.push(msg('productivity', 'Ótimo nível de recuperação. Planeje um bloco de foco profundo.', 0.7));
  }
  if (metrics.stressLevel > 50) {
    list.push(msg('health', 'Sugestão: 5 minutos de respiração ou meditação.', 0.8));
  }
  const focusImproving = metrics.focusTrend > 0.05;
  if (focusImproving) {
    list.push(msg('learning', 'Seu foco está melhorando. Considere estudar um tópico novo.', 0.6));
  }
  if (!entries.length) {
    list.push(msg('focus', 'Faça seu primeiro check-in de humor/energia/foco.', 1));
  }
  const ruleBased = list.map(r => ({ ...r, id: uid(), userId, createdAt: new Date().toISOString() }));
  const aiBased = aiRecommendations(entries).map(r => ({ ...r, userId }));
  return [...aiBased, ...ruleBased].sort((a,b) => b.score - a.score);
}

function msg(category: Recommendation['category'], message: string, score: number): BareRec {
  return { category, message, score };
}
