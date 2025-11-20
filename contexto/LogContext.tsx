import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { RegistroTrabalho, TipoAtividade } from '../model/atividade';
import { useAuth } from './AuthContext';
import { salvarAtividade, carregarAtividadesPeriodo } from '../service/atividadeService';

interface LogValue {
  logs: RegistroTrabalho[];
  addEntry: (data: Omit<RegistroTrabalho, 'id' | 'userId' | 'createdAt'>) => void;
  totalWork: number;
  byType: Record<string, number>;
  clearAll: () => void;
}

const LogContext = createContext<LogValue>({ logs: [], addEntry: () => {}, totalWork: 0, byType: {}, clearAll: () => {} });

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const [logs, setLogs] = useState<RegistroTrabalho[]>([]);
  const [totalWork, setTotal] = useState(0);
  const [byType, setByType] = useState<Record<string, number>>({});

  const refresh = useCallback(() => {
    if (!session) return;
    const today = new Date();
    const inicio = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const fim = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    carregarAtividadesPeriodo(inicio.toISOString(), fim.toISOString())
      .then(atividades => {
        const mapped: RegistroTrabalho[] = atividades.map(a => ({
          id: String(a.atividadeId),
          userId: String(a.usuarioId),
          task: a.descricao ?? 'Atividade',
          durationMinutes: Number(a.duracaoMinutosAtividade ?? 0),
          type: mapTipoAtividade(a.tipoAtividade),
          createdAt: a.inicio,
        }));
        setLogs(mapped);
        const total = mapped.reduce((acc, l) => acc + l.durationMinutes, 0);
        setTotal(total);
        const grouped: Record<string, number> = {};
        mapped.forEach(l => {
          grouped[l.type] = (grouped[l.type] ?? 0) + l.durationMinutes;
        });
        setByType(grouped);
      })
      .catch(() => {});
  }, [session]);

  useEffect(() => { refresh(); }, [refresh]);

  const addEntry = useCallback((data: Omit<RegistroTrabalho, 'id' | 'userId' | 'createdAt'>) => {
    if (!session) {
      console.log('Usuário não autenticado ao tentar registrar atividade.');
      return;
    }
    const now = new Date();
    const payload = {
      tipoAtividade: data.type as any,
      inicio: now.toISOString(),
      fim: new Date(now.getTime() + data.durationMinutes * 60000).toISOString(),
      descricao: data.task,
    };
    salvarAtividade(payload).then(() => refresh()).catch(() => {});
  }, [session, refresh]);

  const clearAll = useCallback(() => {
    setLogs([]);
    setTotal(0);
    setByType({});
  }, []);

  return (
    <LogContext.Provider value={{ logs, addEntry, totalWork, byType, clearAll }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => useContext(LogContext);

function mapTipoAtividade(tipo: string): TipoAtividade {
  switch (tipo) {
    case 'EXERCICIO_FISICO':
    case 'TRABALHO_CRIATIVO':
    case 'PAUSA_ATIVA':
    case 'LAZER_SOCIAL':
    case 'DESCANSO_PASSIVO':
    case 'ESTUDO_APRENDIZADO':
    case 'TRABALHO_FOCO':
    case 'MEDITACAO_MINDFULNESS':
      return tipo as TipoAtividade;
    default:
      return TipoAtividade.ESTUDO_APRENDIZADO;
  }
}
