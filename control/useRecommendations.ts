import { useEffect, useState } from 'react';
import { Recommendation, WellbeingEntry, FatigueMetrics } from '../model/types';
import { computeMetrics } from '../service/analyticsService';
import { buildRecommendations } from '../service/recommendationService';

export function useRecommendations(userId: string, entries: WellbeingEntry[]) {
  const [metrics, setMetrics] = useState<FatigueMetrics>({ stressLevel: 0, recoveryIndex: 0, fatigueIndex: 0, focusTrend: 0 });
  const [recs, setRecs] = useState<Recommendation[]>([]);

  useEffect(() => {
    const m = computeMetrics(entries);
    setMetrics(m);
    const r = buildRecommendations(userId, entries, m);
    setRecs(r);
  }, [userId, entries]);

  return { metrics, recs };
}
