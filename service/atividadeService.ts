import { AtividadeRequest, AtividadeResponse } from '../types/Atividade';
import { postAtividade, listarAtividadesPeriodo } from '../fetcher/atividade';

export async function salvarAtividade(data: AtividadeRequest): Promise<AtividadeResponse> {
    return postAtividade(data);
}

export async function carregarAtividadesPeriodo(inicioISO: string, fimISO: string): Promise<AtividadeResponse[]> {
    return listarAtividadesPeriodo(inicioISO, fimISO);
}
