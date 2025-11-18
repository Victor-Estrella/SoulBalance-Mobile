import { uid } from '../utils/validators';
import { AuthSession, User } from '../model/user';
import { storage } from './storageService';
import { postLogin, postSignup, postUpdateUser } from '../fetcher/auth';
import { AuthSessionRemote } from '../types/Auth';

const SESSION_KEY = 'session_v1';
const REMOTE_ENABLED = !!(process.env.EXPO_PUBLIC_API_BASE_URL);

export async function signup(name: string, email: string, password: string): Promise<AuthSession> {
  if (REMOTE_ENABLED) {
    const remote: AuthSessionRemote = await postSignup({ name, email, password });
    const session: AuthSession = {
      token: remote.token,
      user: {
        id: String(remote.user.id),
        name: remote.user.name,
        email: remote.user.email,
        createdAt: remote.user.createdAt,
      },
      expiresAt: remote.expiresAt,
    };
    await storage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }
  // Fallback local (simulado)
  const user: User = { id: uid(), name, email, createdAt: new Date().toISOString() };
  const session: AuthSession = {
    token: uid(),
    user,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
  };
  await storage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function login(email: string, password: string): Promise<AuthSession | null> {
  const stored = await storage.getItem(SESSION_KEY);
  if (stored) return JSON.parse(stored);
  if (REMOTE_ENABLED) {
    const remote: AuthSessionRemote = await postLogin({ email, password });
    const session: AuthSession = {
      token: remote.token,
      user: {
        id: String(remote.user.id),
        name: remote.user.name,
        email: remote.user.email,
        createdAt: remote.user.createdAt,
      },
      expiresAt: remote.expiresAt,
    };
    await storage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }
  return signup(email.split('@')[0], email, password);
}

export async function getSession(): Promise<AuthSession | null> {
  const stored = await storage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

export async function logout(): Promise<void> {
  await storage.removeItem(SESSION_KEY);
}

export async function updateUser(updates: Partial<Pick<User, 'name' | 'email'>>): Promise<AuthSession | null> {
  const stored = await storage.getItem(SESSION_KEY);
  if (!stored) return null;
  const session: AuthSession = JSON.parse(stored);
  if (REMOTE_ENABLED) {
    const updatedUser = await postUpdateUser(session.token, { name: updates.name, email: updates.email });
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
  const next: AuthSession = { ...session, user: { ...session.user, ...updates } };
  await storage.setItem(SESSION_KEY, JSON.stringify(next));
  return next;
}
