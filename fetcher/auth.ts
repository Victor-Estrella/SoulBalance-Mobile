
import { api } from './http';
import { LoginRequest, SignupRequest, UpdateUserRequest } from '../types/Auth';
import { UsuarioResponse } from '../types/Usuario';


export async function postSignup(data: SignupRequest): Promise<UsuarioResponse> {
  // Ajusta o campo 'password' para 'senha' conforme backend espera
  const payload = {
    ...data,
    senha: data.password,
  };
  delete payload.password;
  try {
    const res = await api.post<UsuarioResponse>('/usuarios', payload);
    return res.data;
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    throw error;
  }
}

// O backend espera o campo 'senha' (não 'password')
export async function postLogin(data: LoginRequest): Promise<{ token: string }> {
  const payload = {
    email: data.email,
    senha: (data as any).senha ?? data.password,
  };
  const res = await api.post<{ token: string }>('/login', payload);
  return res.data;
}

export async function postUpdateUser(userId: string, updates: UpdateUserRequest): Promise<UsuarioResponse> {
  if (!userId) throw new Error('ID do usuário não informado para atualização!');
  const res = await api.put<UsuarioResponse>(`/usuarios/${userId}`, updates);
  return res.data;
}
export async function deleteUser(userId: string): Promise<void> {
  if (!userId) throw new Error('ID do usuário não informado para exclusão!');
  await api.delete(`/usuarios/${userId}`);
}

// Busca usuário por email (garante compatibilidade com backend)
export async function buscarUsuarioPorEmail(email: string) {
  const resp = await api.get('/usuarios/email', { params: { email } });
  return resp.data;
}