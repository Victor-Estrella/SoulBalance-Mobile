export interface EntradaBemEstar {
  id: string;
  userId: string;
  mood: number;
  energy: number;
  focus: number;
  heartRate?: number;
  sleepHours?: number;
  activityMinutes?: number;
  createdAt: string;
  source: 'manual' | 'sensor' | 'simulated';
}
