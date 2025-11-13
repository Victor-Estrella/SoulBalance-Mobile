import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { WorkLogEntry } from '../model/types';
import { addLog, listLogs, summarize } from '../service/logService';
import { useAuth } from './AuthContext';

interface LogValue {
  logs: WorkLogEntry[];
  addEntry: (data: Omit<WorkLogEntry, 'id' | 'userId' | 'createdAt'>) => void;
  totalWork: number;
  byType: Record<string, number>;
}

const LogContext = createContext<LogValue>({ logs: [], addEntry: () => {}, totalWork: 0, byType: {} });

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const [logs, setLogs] = useState<WorkLogEntry[]>([]);
  const [totalWork, setTotal] = useState(0);
  const [byType, setByType] = useState<Record<string, number>>({});

  const refresh = useCallback(() => {
    if (!session) return;
    setLogs(listLogs(session.user.id));
    const s = summarize(session.user.id);
    setTotal(s.totalWork);
    setByType(s.byType);
  }, [session]);

  useEffect(() => { refresh(); }, [refresh]);

  const addEntry = useCallback((data: Omit<WorkLogEntry, 'id' | 'userId' | 'createdAt'>) => {
    if (!session) return;
    addLog(session.user.id, data);
    refresh();
  }, [session, refresh]);

  return (
    <LogContext.Provider value={{ logs, addEntry, totalWork, byType }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => useContext(LogContext);
