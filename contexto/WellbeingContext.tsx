import React, { createContext, useContext } from 'react';
import { useWellbeingControl } from '../control/WellbeingControl';
import { EntradaBemEstar } from '../model/wellbeing';

interface WellbeingValue {
  entries: EntradaBemEstar[];
  addCheckin: (data: Omit<EntradaBemEstar, 'id' | 'createdAt' | 'source' | 'userId'>) => void;
  simulate: () => void;
  refresh: () => void;
  clearAll: () => void;
  loading: boolean;
  error: string | null;
}

const WellbeingContext = createContext<WellbeingValue | undefined>(undefined);

export const WellbeingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const control = useWellbeingControl();
  return (
    <WellbeingContext.Provider value={control}>
      {children}
    </WellbeingContext.Provider>
  );
};

export const useWellbeing = () => {
  const ctx = useContext(WellbeingContext);
  if (!ctx) throw new Error('useWellbeing deve ser usado dentro de WellbeingProvider');
  return ctx;
};
