import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { WellbeingEntry } from '../model/types';
import { addManualEntry, simulateSensor, listEntries, clearEntries } from '../service/wellbeingService';
import { useAuth } from './AuthContext';

interface WellbeingValue {
  entries: WellbeingEntry[];
  addCheckin: (data: Omit<WellbeingEntry, 'id' | 'createdAt' | 'source' | 'userId'>) => void;
  simulate: () => void;
  refresh: () => void;
  clearAll: () => void;
}

const WellbeingContext = createContext<WellbeingValue>({ entries: [], addCheckin: () => {}, simulate: () => {}, refresh: () => {}, clearAll: () => {} });

export const WellbeingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const [entries, setEntries] = useState<WellbeingEntry[]>([]);

  const refresh = useCallback(() => {
    if (!session) return;
    setEntries(listEntries(session.user.id));
  }, [session]);

  useEffect(() => { refresh(); }, [refresh]);

  const addCheckin = useCallback((data: Omit<WellbeingEntry, 'id' | 'createdAt' | 'source' | 'userId'>) => {
    if (!session) return;
    addManualEntry({ ...data, userId: session.user.id });
    refresh();
  }, [session, refresh]);

  const simulate = useCallback(() => {
    if (!session) return;
    simulateSensor(session.user.id);
    refresh();
  }, [session, refresh]);

  const clearAll = useCallback(() => {
    if (!session) return;
    clearEntries(session.user.id);
    refresh();
  }, [session, refresh]);

  return (
    <WellbeingContext.Provider value={{ entries, addCheckin, simulate, refresh, clearAll }}>
      {children}
    </WellbeingContext.Provider>
  );
};

export const useWellbeing = () => useContext(WellbeingContext);
