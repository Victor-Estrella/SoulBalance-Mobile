
import { AtividadeRequest, AtividadeResponse } from '../types/Atividade';
export type { TipoAtividade } from '../model/atividade';
import { postAtividade, listarHistoricoUsuario } from '../fetcher/atividade';

export async function salvarAtividade(data: AtividadeRequest): Promise<AtividadeResponse> {
    // Não precisa mais enviar userId, backend pega do usuário autenticado
    return postAtividade(data);
}


// Buscar histórico de atividades do usuário
export async function carregarHistoricoUsuario(idUsuario: number): Promise<AtividadeResponse[]> {
    const result = await listarHistoricoUsuario(idUsuario);
    return result;
}
