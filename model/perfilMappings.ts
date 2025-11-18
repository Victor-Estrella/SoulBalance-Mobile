import { PerfilEvolutivo } from './perfil';
import { uid } from '../utils/validators';

// Parse PerfilEvolutivo jsonCompetencias string
export function parsePerfilCompetencias(jsonCompetencias: string | null | undefined): string[] {
  if (!jsonCompetencias) return [];
  try {
    const parsed = JSON.parse(jsonCompetencias);
    return Array.isArray(parsed) ? parsed.filter(x => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

// Build PerfilEvolutivo from raw backend response
export function buildPerfilEvolutivo(raw: any): PerfilEvolutivo {
  return {
    perfilId: String(raw.perfil_id ?? uid()),
    usuarioId: String(raw.fk_id_usuario ?? raw.usuarioId ?? ''),
    ptoAutocuidado: Number(raw.pto_autocuidado ?? 0),
    ptoResiliencia: Number(raw.pto_resiliencia ?? 0),
    dataLastUpdate: raw.data_last_update ?? new Date().toISOString(),
    statusCurto: raw.status_curto ?? raw.statusCurto ?? '',
    competencias: parsePerfilCompetencias(raw.json_competencias),
  };
}
