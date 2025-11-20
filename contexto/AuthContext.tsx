import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthSession, User } from '../model/user';
import { login as doLogin, signup as doSignup, logout as doLogout, getSession } from '../service/authService';

interface AuthContextValue {
  session: AuthSession | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
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


  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
