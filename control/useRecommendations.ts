import { useEffect, useState } from 'react';
import { Recommendation, WellbeingEntry, FatigueMetrics } from '../model/types';
import { computeMetrics } from '../service/analyticsService';
import { buildRecommendations } from '../service/recommendationService';

export function useRecommendations(userId: string, entries: WellbeingEntry[]) {
  const [metrics, setMetrics] = useState<FatigueMetrics>({ stressLevel: 0, recoveryIndex: 0, fatigueIndex: 0, focusTrend: 0 });
  const [recs, setRecs] = useState<Recommendation[]>([]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const m = computeMetrics(entries);
      setMetrics(m);
      try {
        const r = await buildRecommendations(userId, entries, m);
        if (!cancelled) setRecs(r);
      } catch {
        if (!cancelled) setRecs([]);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [userId, entries]);

  return { metrics, recs };
}
