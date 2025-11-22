import { api } from './http';
import { CheckinManualRequest, CheckinManualResponse } from '../types/Checkin';

export async function postCheckinManual(data: CheckinManualRequest): Promise<CheckinManualResponse> {
  try {
    const res = await api.post<CheckinManualResponse>('/checkin-manual', data);
    return res.data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      console.error('[CHECKIN] Erro 404:', error?.response?.data);
      throw new Error('Endpoint de check-in não encontrado. Verifique a URL ou backend.');
    }
    console.error('[CHECKIN] Erro ao enviar check-in:', error);
    throw error;
  }
}

export async function listarCheckinsUsuario(): Promise<CheckinManualResponse[]> {
  // Recupera idUsuario do usuário logado
  let idUsuario = '';
  try {
    const sessionRaw = await import('../service/authService');
    const session = await sessionRaw.getSession();
    idUsuario = session?.user?.id || '';
  } catch (e) {
    console.error('[CHECKIN] Erro ao recuperar sessão:', e);
  }
  if (!idUsuario) throw new Error('ID do usuário não encontrado na sessão.');
  const url = `/checkin-manual/historico/${idUsuario}`;
  const res = await api.get<CheckinManualResponse[]>(url);
  return res.data;
}
