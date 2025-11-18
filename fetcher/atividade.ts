import { api } from './http';
import { AtividadeRequest, AtividadeResponse, TipoAtividade } from '../types/Atividade';

export async function postAtividade(userId: number, data: AtividadeRequest): Promise<AtividadeResponse> {
  const res = await api.post<AtividadeResponse>(`/atividade/users/${userId}/atividades`, data);
  return res.data;
}

export async function listarAtividadesPeriodo(userId: number, inicio: string, fim: string): Promise<AtividadeResponse[]> {
  const res = await api.get<AtividadeResponse[]>(`/atividade/users/${userId}/atividades/historico`, { params: { inicio, fim } });
  return res.data;
}

export async function listarTodasAtividades(): Promise<AtividadeResponse[]> {
  const res = await api.get<AtividadeResponse[]>('/atividade/atividades');
  return res.data;
}
