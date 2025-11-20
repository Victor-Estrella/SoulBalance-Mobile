import React, { createContext, useContext } from 'react';
import { useLogControl } from '../control/LogControl';
import { RegistroTrabalho } from '../model/atividade';

interface LogValue {
  entries: RegistroTrabalho[];
  addEntry: (data: Omit<RegistroTrabalho, 'id' | 'userId' | 'createdAt'>) => void;
  refresh: () => void;
  clearAll: () => void;
  totalWork: number;
  byType: Record<string, number>;
  loading: boolean;
  error: string | null;
}

const LogContext = createContext<LogValue | undefined>(undefined);


export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const control = useLogControl();
  return (
    <LogContext.Provider value={control}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => {
  const ctx = useContext(LogContext);
  if (!ctx) throw new Error('useLogs deve ser usado dentro de LogProvider');
  return ctx;
};

