import { uid } from '../utils/validators';
import { AuthSession, User } from '../model/types';
import { storage } from './storage';
import { postLogin, postSignup, postUpdateUser } from '../fetcher/auth';

const SESSION_KEY = 'session_v1';
const REMOTE_ENABLED = !!(process.env.EXPO_PUBLIC_API_BASE_URL);

export async function signup(name: string, email: string, password: string): Promise<AuthSession> {
  if (REMOTE_ENABLED) {
    const remote = await postSignup({ name, email, password });
    const session: AuthSession = remote; // mesma forma: token, user, expiresAt
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
    const remote = await postLogin({ email, password });
    await storage.setItem(SESSION_KEY, JSON.stringify(remote));
    return remote;
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
    const updatedUser = await postUpdateUser(session.token, updates);
    const next: AuthSession = { ...session, user: updatedUser };
    await storage.setItem(SESSION_KEY, JSON.stringify(next));
    return next;
  }
  const next: AuthSession = { ...session, user: { ...session.user, ...updates } };
  await storage.setItem(SESSION_KEY, JSON.stringify(next));
  return next;
}
