import { AtividadeRequest, AtividadeResponse } from '../types/Atividade';
import { postAtividade, listarAtividadesPeriodo } from '../fetcher/atividade';

export async function salvarAtividade(userId: number, data: AtividadeRequest): Promise<AtividadeResponse> {
    return postAtividade(userId, data);
}

export async function carregarAtividadesPeriodo(userId: number, inicioISO: string, fimISO: string): Promise<AtividadeResponse[]> {
    return listarAtividadesPeriodo(userId, inicioISO, fimISO);
}
