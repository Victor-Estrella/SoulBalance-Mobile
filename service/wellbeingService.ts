import { WellbeingEntry } from '../model/types';
import { uid, clamp } from '../utils/validators';

let cache: WellbeingEntry[] = [];

export function addManualEntry(data: Omit<WellbeingEntry, 'id' | 'createdAt' | 'source'>): WellbeingEntry {
  const entry: WellbeingEntry = {
    ...data,
    id: uid(),
    createdAt: new Date().toISOString(),
    source: 'manual'
  };
  cache.push(entry);
  return entry;
}

export function simulateSensor(userId: string): WellbeingEntry {
  const entry: WellbeingEntry = {
    id: uid(),
    userId,
    mood: clamp(Math.round(Math.random() * 4) + 1, 1, 5),
    energy: clamp(Math.round(Math.random() * 4) + 1, 1, 5),
    focus: clamp(Math.round(Math.random() * 4) + 1, 1, 5),
    heartRate: 60 + Math.round(Math.random() * 40),
    sleepHours: Math.round(Math.random() * 8),
    activityMinutes: Math.round(Math.random() * 120),
    createdAt: new Date().toISOString(),
    source: 'simulated'
  };
  cache.push(entry);
  return entry;
}

export function listEntries(userId: string): WellbeingEntry[] {
  return cache.filter(e => e.userId === userId).sort((a,b) => a.createdAt < b.createdAt ? 1 : -1);
}

export function clearEntries(userId: string) {
  cache = cache.filter(e => e.userId !== userId);
}
