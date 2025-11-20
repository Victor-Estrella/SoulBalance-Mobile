

import { AuthSession } from '../model/user';
import { storage } from './storageService';
import { postLogin, postSignup, postUpdateUser, deleteUser, buscarUsuarioPorEmail } from '../fetcher/auth';
import { UsuarioResponse } from '../types/Usuario';

import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';

async function setToken(token: string) { await AsyncStorage.setItem(TOKEN_KEY, token); }
async function removeToken() { await AsyncStorage.removeItem(TOKEN_KEY); }

const SESSION_KEY = 'session_v1';

// Novo fluxo: apenas cadastra o usuário, sem login automático
export async function signup(name: string, email: string, password: string): Promise<UsuarioResponse> {
  // Cria o usuário (não retorna token)
  const user: UsuarioResponse = await postSignup({ name, email, password });
  // O frontend deve redirecionar para a tela de login após o cadastro
  return user;
}

export async function login(email: string, password: string): Promise<AuthSession> {
    // Faz login e busca o usuário pelo email para obter o id
    const loginResult = await postLogin({ email, password });
    await setToken(loginResult.token);
    // Busca o usuário pelo email para obter id, nome, etc
    let usuario = null;
    try {
      usuario = await buscarUsuarioPorEmail(email);
    } catch (e) {
      // Se não encontrar, salva sessão sem id
      usuario = null;
    }
    const session: AuthSession = {
      token: loginResult.token,
      user: {
        id: usuario?.userId ? String(usuario.userId) : '',
        name: usuario?.nome || '',
        email: usuario?.email || email,
        createdAt: usuario?.dataCriacao || '',
      },
      expiresAt: null,
    };
    await storage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
}

export async function getSession(): Promise<AuthSession | null> {
  const stored = await storage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

export async function logout(): Promise<void> {
  await storage.removeItem(SESSION_KEY);
  await removeToken();
}

// updateUser e deleteAccount migrados para userService. Manter apenas login, logout, getSession e signup aqui.