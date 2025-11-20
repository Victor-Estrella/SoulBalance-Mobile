
import { AtividadeRequest, AtividadeResponse } from '../types/Atividade';
export type { TipoAtividade } from '../model/atividade';
import { postAtividade, listarAtividadesPeriodo } from '../fetcher/atividade';

export async function salvarAtividade(data: AtividadeRequest): Promise<AtividadeResponse> {
    // Não precisa mais enviar userId, backend pega do usuário autenticado
    return postAtividade(data);
}

export async function carregarAtividadesPeriodo(inicioISO: string, fimISO: string): Promise<AtividadeResponse[]> {
    // Apenas datas, backend pega usuário autenticado
    return listarAtividadesPeriodo(inicioISO, fimISO);
}
