import { api } from './http';
import { AtividadeRequest, AtividadeResponse } from '../types/Atividade';

export async function postAtividade(data: AtividadeRequest): Promise<AtividadeResponse> {
    const res = await api.post<AtividadeResponse>(`/atividade`, data);
  return res.data;
}

export async function listarTodasAtividades(): Promise<AtividadeResponse[]> {
  const res = await api.get<AtividadeResponse[]>('/atividade');
  return res.data;

}

export async function listarHistoricoUsuario(idUsuario: number): Promise<AtividadeResponse[]> {
  const res = await api.get<AtividadeResponse[]>(`/atividade/atividade/historico/${idUsuario}`);
  return res.data;

}

export async function listarAtividadesPaginadas(page: number = 0, size: number = 2): Promise<AtividadeResponse[]> {
  const res = await api.get(`/atividade/paginacao?pagina=${page}&tamanho=${size}`);
  return res.data.content;
}
