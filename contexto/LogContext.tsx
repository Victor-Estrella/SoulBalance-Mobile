import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { RegistroTrabalho, TipoAtividade } from '../model/atividade';
import { useAuth } from './AuthContext';
import { salvarAtividade, carregarAtividadesPeriodo } from '../service/atividadeService';

interface LogValue {
  entries: RegistroTrabalho[];
  addEntry: (data: Omit<RegistroTrabalho, 'id' | 'userId' | 'createdAt'>) => void;
  refresh: () => void;
  clearAll: () => void;
  totalWork: number;
  byType: Record<string, number>;
}

const LogContext = createContext<LogValue>({ entries: [], addEntry: () => {}, refresh: () => {}, clearAll: () => {}, totalWork: 0, byType: {} });


export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const [entries, setEntries] = useState<RegistroTrabalho[]>([]);
  const [totalWork, setTotal] = useState(0);
  const [byType, setByType] = useState<Record<string, number>>({});

  function formatDateToBackend(dt: Date) {
    // yyyy-MM-dd'T'HH:mm:ss (horário local, sem UTC)
    const pad = (n: number) => String(n).padStart(2, '0');
    return dt.getFullYear() + '-' +
      pad(dt.getMonth() + 1) + '-' +
      pad(dt.getDate()) + 'T' +
      pad(dt.getHours()) + ':' +
      pad(dt.getMinutes()) + ':' +
      pad(dt.getSeconds());
  }

  const refresh = useCallback(() => {
    if (!session) return;
    const now = new Date();
    // Pega o horário local do dispositivo, sem UTC
    const inicio = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const fim = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const inicioStr = formatDateToBackend(inicio);
    const fimStr = formatDateToBackend(fim);
    carregarAtividadesPeriodo(inicioStr, fimStr)
      .then(atividades => {
        console.log('[LogContext] atividades recebidas:', atividades);
        const mapped: RegistroTrabalho[] = atividades.map(a => ({
          id: String(a.atividadeId),
          userId: String(a.usuarioId),
          task: a.descricao ?? 'Atividade',
          durationMinutes: Number(a.duracaoMinutosAtividade ?? 0),
          type: a.tipoAtividade ? mapTipoAtividade(a.tipoAtividade) : TipoAtividade.DESCANSO_PASSIVO,
          createdAt: a.inicio,
        }));
        console.log('[LogContext] mapped entries:', mapped);
        setEntries(mapped);
        const total = mapped.reduce((acc, l) => acc + l.durationMinutes, 0);
        setTotal(total);
        const grouped: Record<string, number> = {};
        mapped.forEach(l => {
          grouped[l.type] = (grouped[l.type] ?? 0) + l.durationMinutes;
        });
        setByType(grouped);
      })
      .catch((err) => {
        console.log('[LogContext] erro ao carregar atividades:', err);
      });
  }, [session]);

  useEffect(() => { refresh(); }, [refresh]);

  const addEntry = useCallback((data: Omit<RegistroTrabalho, 'id' | 'userId' | 'createdAt'>) => {
    if (!session) return;
    const payload = {
      tipoAtividade: data.type as any,
      descricao: data.task,
      durationMinutes: data.durationMinutes,
    };
    console.log('[LogContext] payload enviado ao salvar:', payload);
    salvarAtividade(payload)
      .then((res) => {
        console.log('[LogContext] resposta do salvarAtividade:', res);
        refresh();
      })
      .catch((err) => {
        console.log('[LogContext] erro ao salvar atividade:', err);
      });
  }, [session, refresh]);

  const clearAll = useCallback(() => {
    refresh();
  }, [refresh]);

  return (
    <LogContext.Provider value={{ entries, addEntry, refresh, clearAll, totalWork, byType }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => useContext(LogContext);

function mapTipoAtividade(tipo: string): TipoAtividade {
  if (Object.values(TipoAtividade).includes(tipo as TipoAtividade)) {
    return tipo as TipoAtividade;
  }
  throw new Error(`Tipo de atividade desconhecido: ${tipo}`);
}
