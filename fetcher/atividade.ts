import { api } from './http';
import { AtividadeRequest, AtividadeResponse } from '../types/Atividade';

export async function postAtividade(data: AtividadeRequest): Promise<AtividadeResponse> {
  // Não precisa mais enviar userId, backend pega do usuário autenticado
  const res = await api.post<AtividadeResponse>(`/atividade/atividades`, data);
  return res.data;
}

export async function listarAtividadesPeriodo(inicio: string, fim: string): Promise<AtividadeResponse[]> {
  // Apenas datas, backend pega usuário autenticado
  const res = await api.get<AtividadeResponse[]>(`/atividade/atividades/historico`, { params: { inicio, fim } });
  return res.data;
}

export async function listarTodasAtividades(): Promise<AtividadeResponse[]> {
  const res = await api.get<AtividadeResponse[]>('/atividade/atividades');
  return res.data;
}
