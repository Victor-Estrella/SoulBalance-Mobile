import { useState } from 'react';
import { UsuarioRequest, UsuarioResponse } from '../types/Usuario';
import { userServiceSalvar, userServiceAtualizar, userServiceDeletar } from '../service/userService';

export function useUserControl() {
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const salvar = async (nome: string, email: string, senha: string) => {
    setLoading(true);
    setMensagem(null);
    const req: UsuarioRequest = { name: nome, email, senha };
    try {
      const res = await userServiceSalvar(req);
      setUsuario(res);
      setMensagem('Usuário criado com sucesso.');
      return true;
    } catch (err) {
      setMensagem('Erro ao criar usuário.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const atualizar = async (idUsuario: string, req: UsuarioRequest) => {
    setLoading(true);
    setMensagem(null);
    try {
      const res = await userServiceAtualizar(idUsuario, req);
      setUsuario(res);
      const ok = 'Dados atualizados com sucesso.';
      setMensagem(ok);
      return { sucesso: true, mensagem: ok };
    } catch (err) {
      const msg = 'Erro ao atualizar usuário.';
      setMensagem(msg);
      return { sucesso: false, mensagem: msg };
    } finally {
      setLoading(false);
    }
  };

  const deletar = async (idUsuario: string) => {
    setLoading(true);
    setMensagem(null);
    try {
      await userServiceDeletar(idUsuario);
      setUsuario(null);
      setMensagem('Usuário deletado com sucesso.');
    } catch (err) {
      setMensagem('Erro ao deletar usuário.');
    } finally {
      setLoading(false);
    }
  };

  return { usuario, setUsuario, salvar, atualizar, deletar, loading, mensagem, setMensagem };
}
