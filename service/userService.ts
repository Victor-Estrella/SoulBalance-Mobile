import { UsuarioRequest, UsuarioResponse } from '../types/Usuario';
import { postSignup, postUpdateUser, deleteUser, buscarUsuarioPorEmail } from '../fetcher/auth';

// Criação de usuário (signup)
export async function userServiceSalvar(req: UsuarioRequest): Promise<UsuarioResponse> {
  // Usa o fetcher real para criar usuário
  return await postSignup({ name: req.name, email: req.email, password: req.senha });
}

// Atualização de usuário
export async function userServiceAtualizar(idUsuario: string, req: UsuarioRequest): Promise<UsuarioResponse> {
  // Usa o fetcher real para atualizar usuário
  return await postUpdateUser(idUsuario, req);
}

// Exclusão de usuário
export async function userServiceDeletar(idUsuario: string): Promise<void> {
  await deleteUser(idUsuario);
}

// Buscar usuário por email (opcional, utilitário)
export async function userServiceBuscarPorEmail(email: string): Promise<UsuarioResponse> {
  return await buscarUsuarioPorEmail(email);
}
