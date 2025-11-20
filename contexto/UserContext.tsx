import React, { createContext, useContext } from 'react';
import { useUserControl } from '../control/userControl';
import { UsuarioResponse, UsuarioRequest } from '../types/Usuario';

interface UserValue {
  usuario: UsuarioResponse | null;
  setUsuario: (u: UsuarioResponse | null) => void;
  salvar: (nome: string, email: string, senha: string) => Promise<boolean>;
  atualizar: (idUsuario: string, req: UsuarioRequest) => Promise<{ sucesso: boolean; mensagem: string }>;
  deletar: (idUsuario: string) => Promise<void>;
  loading: boolean;
  mensagem: string | null;
  setMensagem: (msg: string | null) => void;
}

const UserContext = createContext<UserValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const control = useUserControl();
  return (
    <UserContext.Provider value={control}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser deve ser usado dentro de UserProvider');
  return ctx;
};
