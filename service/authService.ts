

import { AuthSession } from '../model/user';
import { storage } from './storageService';
import { postLogin, postSignup, postUpdateUser, deleteUser, buscarUsuarioPorEmail } from '../fetcher/auth';
import { UsuarioResponse } from '../types/Usuario';

import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';

async function setToken(token: string) { await AsyncStorage.setItem(TOKEN_KEY, token); }
async function removeToken() { await AsyncStorage.removeItem(TOKEN_KEY); }

const SESSION_KEY = 'session_v1';

export async function getSession(): Promise<AuthSession | null> {
  const stored = await AsyncStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  return JSON.parse(stored);
}

// Novo fluxo: apenas cadastra o usuário, sem login automático
export async function signup(name: string, email: string, password: string): Promise<UsuarioResponse> {
  // Cria o usuário (não retorna token)
  const user: UsuarioResponse = await postSignup({ name, email, password });
  // O frontend deve redirecionar para a tela de login após o cadastro
  return user;
}

export async function login(email: string, password: string): Promise<AuthSession> {
  try {
    // Faz login e salva o token
    const loginResult = await postLogin({ email, password });
    await setToken(loginResult.token);
    // Busca o usuário pelo email para obter o id real
    let idUsuario = '';
    try {
      const resp = await import('../fetcher/auth');
      idUsuario = await resp.buscarUsuarioPorEmail(email);
    } catch {}
    const session: AuthSession = {
      token: loginResult.token,
      user: {
        id: idUsuario ? String(idUsuario) : '',
        name: '',
        email: email,
        createdAt: '',
      },
      expiresAt: '',
    };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  } catch (e: any) {
    throw new Error(e?.message || 'Erro ao fazer login.');
  }
}

export async function logout(): Promise<void> {
  await storage.removeItem(SESSION_KEY);
  await removeToken();
}


export async function updateUser(updates: { name?: string; email?: string; senha?: string }): Promise<AuthSession> {
  const stored = await storage.getItem(SESSION_KEY);
  if (!stored) return null;
  let session: AuthSession = JSON.parse(stored);
  let userId = session.user?.id;
  // Se não houver id na sessão, tenta buscar pelo email
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
  const updatedUser = await postUpdateUser(String(userId), { name: updates.name, email: updates.email, senha: updates.senha });
  const next: AuthSession = {
    ...session,
    user: {
      id: String(updatedUser.userId),
      name: updatedUser.nome,
      email: updatedUser.email,
      createdAt: session.user.createdAt,
    },
  };
  await storage.setItem(SESSION_KEY, JSON.stringify(next));
  return next;
}

export async function deleteAccount(): Promise<void> {
  const stored = await storage.getItem(SESSION_KEY);
  if (!stored) throw new Error('Sessão não encontrada.');
  let session: AuthSession = JSON.parse(stored);
  let userId = session.user?.id;
  // Se não houver id na sessão, tenta buscar pelo email
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
  await logout();
}