import { api } from './http';
import { UsuarioRequest, UsuarioResponse } from '../types/Usuario';

export async function criarUsuario(data: UsuarioRequest): Promise<UsuarioResponse> {
  const res = await api.post<UsuarioResponse>('/usuarios', data);
  return res.data;
}

export async function buscarUsuario(idUsuario: number): Promise<UsuarioResponse> {
  const res = await api.get<UsuarioResponse>(`/usuarios/${idUsuario}`);
  return res.data;
}

export async function atualizarUsuario(idUsuario: number, data: UsuarioRequest): Promise<UsuarioResponse> {
  const res = await api.put<UsuarioResponse>(`/usuarios/${idUsuario}`, data);
  return res.data;
}

export async function deletarUsuario(idUsuario: number): Promise<void> {
  await api.delete(`/usuarios/${idUsuario}`);
}
