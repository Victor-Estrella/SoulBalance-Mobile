import { WorkLogEntry } from '../model/types';
import { uid } from '../utils/validators';

let logs: WorkLogEntry[] = [];

export function addLog(userId: string, data: Omit<WorkLogEntry, 'id' | 'userId' | 'createdAt'>): WorkLogEntry {
  const entry: WorkLogEntry = { ...data, id: uid(), userId, createdAt: new Date().toISOString() };
  logs.push(entry);
  return entry;
}

export function listLogs(userId: string): WorkLogEntry[] {
  return logs.filter(l => l.userId === userId).sort((a,b) => a.createdAt < b.createdAt ? 1 : -1);
}

export function summarize(userId: string) {
  const userLogs = listLogs(userId);
  const totalWork = userLogs.reduce((sum, l) => sum + l.durationMinutes, 0);
  const byType = userLogs.reduce<Record<string, number>>((acc, l) => { acc[l.type] = (acc[l.type] ?? 0) + l.durationMinutes; return acc; }, {});
  return { totalWork, byType };
}

export function clearLogs(userId: string) {
  logs = logs.filter(l => l.userId !== userId);
}
