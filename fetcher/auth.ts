// Fetcher layer for authentication (placeholder endpoints)
// Adjust BASE_URL to real backend when available
import { User } from '../model/types';

const AUTH_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL as string) || 'https://example-auth-api.com';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

interface SignupPayload { name: string; email: string; password: string; }
interface LoginPayload { email: string; password: string; }

export interface RemoteAuthResponse {
  token: string;
  user: User;
  expiresAt: string;
}

export async function postSignup(data: SignupPayload): Promise<RemoteAuthResponse> {
  const res = await fetch(`${AUTH_BASE_URL}/signup`, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(data) });
  if (!res.ok) throw new Error(`Signup failed ${res.status}`);
  return res.json();
}

export async function postLogin(data: LoginPayload): Promise<RemoteAuthResponse> {
  const res = await fetch(`${AUTH_BASE_URL}/login`, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(data) });
  if (!res.ok) throw new Error(`Login failed ${res.status}`);
  return res.json();
}

export async function postUpdateUser(token: string, updates: Partial<Pick<User,'name'|'email'>>): Promise<User> {
  const res = await fetch(`${AUTH_BASE_URL}/user`, { method: 'PATCH', headers: { ...JSON_HEADERS, Authorization: `Bearer ${token}` }, body: JSON.stringify(updates) });
  if (!res.ok) throw new Error(`Update user failed ${res.status}`);
  return res.json();
}
