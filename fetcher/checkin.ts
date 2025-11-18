import { api } from './http';
import { CheckinManualRequest, CheckinManualResponse } from '../types/Checkin';

export async function postCheckinManual(data: CheckinManualRequest): Promise<CheckinManualResponse> {
  const res = await api.post<CheckinManualResponse>('/checkin-manual', data);
  return res.data;
}

export async function listarCheckinsUsuario(): Promise<CheckinManualResponse[]> {
  const res = await api.get<CheckinManualResponse[]>('/checkin-manual/historico');
  return res.data;
}
