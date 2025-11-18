import { api } from './http';
import { AuthSessionRemote, LoginRequest, SignupRequest, UpdateUserRequest } from '../types/Auth';
import { UsuarioResponse } from '../types/Usuario';

export async function postSignup(data: SignupRequest): Promise<AuthSessionRemote> {
  const res = await api.post<AuthSessionRemote>('/auth/signup', data);
  return res.data;
}

export async function postLogin(data: LoginRequest): Promise<AuthSessionRemote> {
  const res = await api.post<AuthSessionRemote>('/auth/login', data);
  return res.data;
}

export async function postUpdateUser(token: string, updates: UpdateUserRequest): Promise<UsuarioResponse> {
  const res = await api.put<UsuarioResponse>('/usuarios/me', updates, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
