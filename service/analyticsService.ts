import { WellbeingEntry, FatigueMetrics } from '../model/types';

export function computeMetrics(entries: WellbeingEntry[]): FatigueMetrics {
  if (!entries.length) {
    return { stressLevel: 0, recoveryIndex: 0, fatigueIndex: 0, focusTrend: 0 };
  }
  const recent = entries.slice(0, 10);
  const avg = (arr: number[]) => arr.reduce((a,b) => a + b, 0) / arr.length;
  const moodAvg = avg(recent.map(e => e.mood));
  const energyAvg = avg(recent.map(e => e.energy));
  const focusAvg = avg(recent.map(e => e.focus));
  const fatigueIndex = Math.round((6 - energyAvg) * 20);
  const stressLevel = Math.round((6 - moodAvg) * 20);
  const recoveryIndex = Math.round((energyAvg + moodAvg) / 10 * 100);
  const half = Math.floor(recent.length / 2);
  const h1 = avg(recent.slice(0, half).map(e => e.focus));
  const h2 = avg(recent.slice(half).map(e => e.focus));
  const focusTrend = Number(((h2 - h1) / 5).toFixed(2));
  return { stressLevel, recoveryIndex, fatigueIndex, focusTrend };
}
