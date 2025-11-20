import { useState, useCallback } from 'react';
import { RegistroTrabalho, TipoAtividade } from '../model/atividade';
import { carregarAtividadesPeriodo, salvarAtividade } from '../service/atividadeService';
import { useAuth } from '../contexto/AuthContext';

export function useLogControl() {
  const { session } = useAuth();
  const [entries, setEntries] = useState<RegistroTrabalho[]>([]);
  const [totalWork, setTotal] = useState(0);
  const [byType, setByType] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar atividades do período atual
  const refresh = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const inicio = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const fim = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const pad = (n: number) => String(n).padStart(2, '0');
      const formatDate = (dt: Date) => dt.getFullYear() + '-' + pad(dt.getMonth() + 1) + '-' + pad(dt.getDate()) + 'T' + pad(dt.getHours()) + ':' + pad(dt.getMinutes()) + ':' + pad(dt.getSeconds());
      const inicioStr = formatDate(inicio);
      const fimStr = formatDate(fim);
      const atividades = await carregarAtividadesPeriodo(inicioStr, fimStr);
      const mapped: RegistroTrabalho[] = atividades.map(a => ({
        id: String(a.atividadeId),
        userId: String(a.usuarioId),
        task: a.descricao ?? 'Atividade',
        durationMinutes: Number(a.duracaoMinutosAtividade ?? 0),
        type: a.tipoAtividade ? a.tipoAtividade : TipoAtividade.DESCANSO_PASSIVO,
        createdAt: a.inicio,
      }));
      setEntries(mapped);
      setTotal(mapped.reduce((acc, l) => acc + l.durationMinutes, 0));
      const grouped: Record<string, number> = {};
      mapped.forEach(l => {
        grouped[l.type] = (grouped[l.type] ?? 0) + l.durationMinutes;
      });
      setByType(grouped);
    } catch (err: any) {
      setError('Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Função para adicionar nova atividade
  const addEntry = useCallback(async (data: Omit<RegistroTrabalho, 'id' | 'userId' | 'createdAt'>) => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        tipoAtividade: data.type as any,
        descricao: data.task,
        durationMinutes: data.durationMinutes,
      };
      await salvarAtividade(payload);
      await refresh();
    } catch (err: any) {
      setError('Erro ao salvar atividade');
    } finally {
      setLoading(false);
    }
  }, [session, refresh]);

  const clearAll = useCallback(() => {
    setEntries([]);
    setTotal(0);
    setByType({});
  }, []);

  return { entries, addEntry, refresh, clearAll, totalWork, byType, loading, error };
}
