import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { EntradaBemEstar } from '../model/wellbeing';
import { useAuth } from './AuthContext';
import { salvarCheckin, carregarCheckins } from '../service/checkinService';

interface WellbeingValue {
  entries: EntradaBemEstar[];
  addCheckin: (data: Omit<EntradaBemEstar, 'id' | 'createdAt' | 'source' | 'userId'>) => void;
  simulate: () => void;
  refresh: () => void;
  clearAll: () => void;
}

const WellbeingContext = createContext<WellbeingValue>({ entries: [], addCheckin: () => {}, simulate: () => {}, refresh: () => {}, clearAll: () => {} });

export const WellbeingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const [entries, setEntries] = useState<EntradaBemEstar[]>([]);

  const refresh = useCallback(() => {
    if (!session) return;
    carregarCheckins().then(setEntries).catch(() => {});
  }, [session]);

  useEffect(() => { refresh(); }, [refresh]);

  const addCheckin = useCallback((data: Omit<EntradaBemEstar, 'id' | 'createdAt' | 'source' | 'userId'>) => {
    if (!session) return;
    salvarCheckin(data.mood, data.energy, data.focus)
      .then(() => refresh())
      .catch(() => {});
  }, [session, refresh]);

  const simulate = useCallback(() => {
  }, []);

  const clearAll = useCallback(() => {
    refresh();
  }, [refresh]);

  return (
    <WellbeingContext.Provider value={{ entries, addCheckin, simulate, refresh, clearAll }}>
      {children}
    </WellbeingContext.Provider>
  );
};

export const useWellbeing = () => useContext(WellbeingContext);
