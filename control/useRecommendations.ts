import { useEffect, useState } from 'react';
import { Recommendation } from '../model/recommendation';
import { EntradaBemEstar } from '../model/wellbeing';
import { FatigueMetrics } from '../model/metrics';
import { computeMetrics } from '../service/analyticsService';
import { buildRecommendations } from '../service/recommendationService';

export function useRecommendations(userId: string, entries: EntradaBemEstar[]) {
  const [metrics, setMetrics] = useState<FatigueMetrics>({ stressLevel: 0, recoveryIndex: 0, fatigueIndex: 0, focusTrend: 0 });
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const m = computeMetrics(entries);
      setMetrics(m);
      try {
        setIsLoadingAI(true);
        const r = await buildRecommendations(userId, entries, m);
        if (!cancelled) setRecs(r);
      } catch {
        if (!cancelled) setRecs([]);
      } finally {
        if (!cancelled) setIsLoadingAI(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [userId, entries]);

  return { metrics, recs, isLoadingAI };
}
