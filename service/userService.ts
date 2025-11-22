import { UsuarioRequest, UsuarioResponse } from '../types/Usuario';
import { UpdateUserRequest } from '../types/Auth';
import { postSignup, postUpdateUser, deleteUser, buscarUsuarioPorEmail } from '../fetcher/auth';
import { storage } from './storageService';
import { AuthSession } from '../model/user';

// Criação de usuário (signup)
export async function userServiceSalvar(req: UsuarioRequest): Promise<UsuarioResponse> {
  // Usa o fetcher real para criar usuário
  return await postSignup({ name: req.name, email: req.email, password: req.senha });
}

// Atualiza usuário, buscando id por email se necessário e atualizando storage local
export async function userServiceAtualizar(idUsuario: string, req: UpdateUserRequest): Promise<UsuarioResponse> {
  // Busca sessão local para garantir id correto
  const stored = await storage.getItem('session_v1');
  let userId = idUsuario;
  if (stored) {
    let session: AuthSession = JSON.parse(stored);
    if (!userId && session.user?.id) userId = session.user.id;
    if (!userId && session.user?.email) {
      try {
        const usuario = await buscarUsuarioPorEmail(session.user.email);
        if (usuario && usuario.userId) {
          userId = String(usuario.userId);
          session.user.id = userId;
        }
      } catch (e) {
        throw new Error('ID do usuário não encontrado na sessão!');
      }
    }
    if (!userId) throw new Error('ID do usuário não encontrado na sessão!');
    const updatedUser = await postUpdateUser(String(userId), req);
    // Atualiza storage local
    const next: AuthSession = {
      ...session,
      user: {
        id: String(updatedUser.userId),
        name: updatedUser.nome,
        email: updatedUser.email,
        createdAt: session.user.createdAt,
      },
    };
    await storage.setItem('session_v1', JSON.stringify(next));
    return updatedUser;
  } else {
    // fallback: só faz update
    const updatedUser = await postUpdateUser(String(userId), req);
    return updatedUser;
  }
}

// Exclusão de usuário
// Deleta usuário, buscando id por email se necessário e limpando storage local
export async function userServiceDeletar(idUsuario: string): Promise<void> {
  const stored = await storage.getItem('session_v1');
  let userId = idUsuario;
  if (stored) {
    let session: AuthSession = JSON.parse(stored);
    if (!userId && session.user?.id) userId = session.user.id;
    if (!userId && session.user?.email) {
      try {
        const usuario = await buscarUsuarioPorEmail(session.user.email);
        if (usuario && usuario.userId) {
          userId = String(usuario.userId);
          session.user.id = userId;
        }
      } catch (e) {
        throw new Error('ID do usuário não encontrado na sessão.');
      }
    }
    if (!userId) throw new Error('ID do usuário não encontrado na sessão.');
    await deleteUser(String(userId));
    await storage.removeItem('session_v1');
  } else {
    await deleteUser(String(userId));
  }
}

// Buscar usuário por email (opcional, utilitário)
export async function userServiceBuscarPorEmail(email: string): Promise<UsuarioResponse> {
  return await buscarUsuarioPorEmail(email);
}
