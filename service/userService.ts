import { UsuarioRequest, UsuarioResponse } from '../types/Usuario';
import { criarUsuario, atualizarUsuario, deletarUsuario } from '../fetcher/user';
import { usuarioSchema } from '../model/userSchemas';


export async function userServiceSalvar(req: UsuarioRequest): Promise<UsuarioResponse> {
    await usuarioSchema.validate(req);
    return criarUsuario(req);
}

export async function userServiceAtualizar(idUsuario: string, req: UsuarioRequest): Promise<UsuarioResponse> {
    await usuarioSchema.validate(req);
    return atualizarUsuario(Number(idUsuario), req);
}

export async function userServiceDeletar(idUsuario: string): Promise<void> {
    return deletarUsuario(Number(idUsuario));
}
