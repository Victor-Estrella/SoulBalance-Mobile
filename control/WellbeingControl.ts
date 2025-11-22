import { useState, useCallback } from 'react';
import { EntradaBemEstar } from '../model/wellbeing';
import { carregarCheckins, salvarCheckin } from '../service/checkinService';
import { useAuth } from '../contexto/AuthContext';

export function useWellbeingControl() {
  const { session } = useAuth();
  const [entries, setEntries] = useState<EntradaBemEstar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const list = await carregarCheckins();
      setEntries(list);
    } catch (err) {
      setError('Erro ao carregar check-ins');
    } finally {
      setLoading(false);
    }
  }, [session]);

  const addCheckin = useCallback(async (data: Omit<EntradaBemEstar, 'id' | 'createdAt' | 'source' | 'userId'>) => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      await salvarCheckin(data.mood, data.energy, data.focus);
      setError(null); // Limpa erro se sucesso
      await refresh();
      // Após refresh, mantém só os 5 últimos vindos do backend
      setEntries((prev) => prev.slice(0, 5));
    } catch (err) {
      setError('Erro ao salvar check-in');
    } finally {
      setLoading(false);
    }
  }, [session, refresh]);

  const clearAll = useCallback(() => {
    setEntries([]);
  }, []);

  // Simulação pode ser implementada depois
  const simulate = useCallback(() => {}, []);

  return { entries, addCheckin, simulate, refresh, clearAll, loading, error };
}
