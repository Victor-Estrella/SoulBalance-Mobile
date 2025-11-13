// Internal user model (legacy) kept for app usage
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: string;
}

// Enum mirrors ValorEnun used for humor/energia/foco ratings in backend
export enum ValorEnun {
  PESSIMO = 'PESSIMO',
  RUIM = 'RUIM',
  REGULAR = 'REGULAR',
  BOM = 'BOM',
  OTIMO = 'OTIMO'
}

// Manual check-in entity alignment (CheckinManualEntity)
export interface CheckinManual {
  chekinId: string; // Long id
  usuarioId: string;
  humor: ValorEnun;
  energia: ValorEnun;
  foco: ValorEnun;
  time: string; // LocalDateTime ISO
}

// Sensor data entity (DadosSensorEntity)
export enum TipoDadoSensor {
  HEART_RATE = 'HEART_RATE',
  SLEEP_HOURS = 'SLEEP_HOURS',
  ACTIVITY_MINUTES = 'ACTIVITY_MINUTES'
}
export interface DadoSensor {
  dadoId: string;
  usuarioId: string;
  tipoDado: TipoDadoSensor;
  valor: number; // score/value
  time: string;
}

// Consolidated wellbeing entry (internal app), merging manual + simulated + sensor
export interface WellbeingEntry {
  id: string;
  userId: string;
  mood: number; // 1-5 numeric scale retained internally
  energy: number; // 1-5
  focus: number; // 1-5
  heartRate?: number; // bpm
  sleepHours?: number;
  activityMinutes?: number;
  createdAt: string;
  source: 'manual' | 'sensor' | 'simulated';
}

// Activity entity (AtividadeEntity) + internal categorization
export enum TipoAtividade {
  CREATIVE = 'CREATIVE',
  SOFTSKILL = 'SOFTSKILL',
  DEEPWORK = 'DEEPWORK',
  LEARNING = 'LEARNING'
}
export interface Atividade {
  atividadeId: string;
  usuarioId: string;
  tipoAtividade: TipoAtividade;
  inicio: string; // Instant ISO
  fim: string; // Instant ISO
  duracaoMinutosAtividade: number; // derived
}
// Legacy work log kept for UI compatibility (maps to Atividade)
export interface WorkLogEntry {
  id: string;
  userId: string;
  task: string;
  durationMinutes: number;
  type: TipoAtividade;
  createdAt: string;
}

// Backend Recommendation entity (RecomendacaoEntity)
export interface Recomendacao {
  recomendacaoId: string;
  usuarioId: string;
  sugestao: string;
  time: string;
  metricaId?: string;
}
// Internal enriched recommendation (merges AI + rule + backend)
export interface Recommendation {
  id: string;
  userId: string;
  message: string;
  category: 'rest' | 'focus' | 'health' | 'learning' | 'productivity';
  createdAt: string;
  score: number; // relevance score
  origin?: 'ai' | 'rule' | 'backend';
  metricaId?: string;
}

// Backend metric entity (MetricaBemEstarEntity)
export interface MetricaBemEstar {
  metricaId: string;
  usuarioId: string;
  fadigaScore: number;
  estresseScore: number;
  recuperacaoScore: number;
  dataCriacao: string;
}
// Internal computed metrics (legacy)
export interface FatigueMetrics {
  stressLevel: number; // 0-100 -> maps to estresseScore
  recoveryIndex: number; // 0-100 -> maps to recuperacaoScore
  fatigueIndex: number; // 0-100 -> maps to fadigaScore
  focusTrend: number; // -1..1 (not persisted backend)
}

// Perfil Evolutivo (PerfilEvolutivoEntity)
export interface PerfilEvolutivo {
  perfilId: string;
  usuarioId: string;
  ptoAutocuidado: number;
  ptoResiliencia: number;
  dataLastUpdate: string;
  statusCurto: string;
  competencias: string[]; // parsed from jsonCompetencias
}

// Generative AI outputs
export interface GenerativeInterpretation {
  status_curto: 'em alta' | 'em recuperação' | 'estável' | 'em alerta';
  competencias: string[];
  mensagem: string; // texto empático
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
