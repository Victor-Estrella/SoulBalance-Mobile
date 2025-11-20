import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthSession, User } from '../model/user';
import { login as doLogin, signup as doSignup, logout as doLogout, getSession, updateUser as doUpdateUser } from '../service/authService';

interface AuthContextValue {
  session: AuthSession | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: { name?: string; email?: string; senha?: string }) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateUser: async () => {},
  deleteAccount: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then(s => { setSession(s); setLoading(false); });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const s = await doLogin(email, password);
    setSession(s);
    setLoading(false);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    await doSignup(name, email, password);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    await doLogout();
    setSession(null);
    setLoading(false);
  }, []);

  const updateUser = useCallback(async (updates: { name?: string; email?: string; senha?: string }) => {
    setLoading(true);
    const s = await doUpdateUser(updates);
    setSession(s);
    setLoading(false);
  }, []);

  const deleteAccount = useCallback(async () => {
    await import('../service/authService').then(m => m.deleteAccount());
    setSession(null);
  }, []);
  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, login, signup, logout, updateUser, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
