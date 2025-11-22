import React, { useState } from 'react';
import ScreenContainer from './components/ContainerTela';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import PrimaryButton from './components/ui/PrimaryButton';
import { useTheme } from '../styles/ThemeContext';
import { useLogs } from '../contexto/LogContext';
import { Feather } from '@expo/vector-icons';
import { TipoAtividade } from '../model/atividade';

export default function RegistroHoras() {
  const { addEntry, entries, totalWork, byType, refresh } = useLogs();
  React.useEffect(() => {
    refresh();
  }, [refresh]);
  const { theme } = useTheme();
  const [task, setTask] = useState('Tarefa');
  const [duration, setDuration] = useState('30');
  const [type, setType] = useState<TipoAtividade>(TipoAtividade.DESCANSO_PASSIVO);
  const quicks = [
    { label: 'Focus 25m', task: 'Deep Focus', duration: '25', type: TipoAtividade.TRABALHO_FOCO },
    { label: 'Criativo 15m', task: 'Creative Code', duration: '15', type: TipoAtividade.TRABALHO_CRIATIVO },
    { label: 'Estudo 40m', task: 'Learning', duration: '40', type: TipoAtividade.ESTUDO_APRENDIZADO },
  ];
  return (
    <ScreenContainer title="Registro de Horas">
      <Text style={{ color: theme.colors.textSecondary }}>Novo registro</Text>
      <View style={{ backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing(1.5), marginVertical: theme.spacing(1) }}>
        <TextInput value={task} onChangeText={setTask} style={{ backgroundColor: theme.colors.surfaceAlt, color: theme.colors.textPrimary, padding: theme.spacing(1), borderRadius: theme.radius.sm, marginBottom: theme.spacing(1) }} placeholder="Tarefa" placeholderTextColor={theme.colors.textSecondary} />
        <TextInput value={duration} keyboardType="numeric" onChangeText={setDuration} style={{ backgroundColor: theme.colors.surfaceAlt, color: theme.colors.textPrimary, padding: theme.spacing(1), borderRadius: theme.radius.sm, marginBottom: theme.spacing(1) }} placeholder="Minutos" placeholderTextColor={theme.colors.textSecondary} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(1), marginBottom: theme.spacing(1) }}>
          {[ TipoAtividade.TRABALHO_FOCO, TipoAtividade.EXERCICIO_FISICO, TipoAtividade.PAUSA_ATIVA, TipoAtividade.LAZER_SOCIAL, TipoAtividade.TRABALHO_CRIATIVO, TipoAtividade.DESCANSO_PASSIVO, TipoAtividade.ESTUDO_APRENDIZADO,  TipoAtividade.MEDITACAO_MINDFULNESS ].map(t => (
            <TouchableOpacity key={t} onPress={() => setType(t)} style={{ paddingVertical: theme.spacing(0.75), paddingHorizontal: theme.spacing(2), borderWidth: 1, borderColor: type === t ? theme.colors.accent : theme.colors.border, backgroundColor: type === t ? theme.colors.accent : 'transparent', borderRadius: theme.radius.pill }}>
              <Text style={{ color: type === t ? theme.colors.white : theme.colors.textSecondary, fontSize: theme.typography.sizes.sm }}>{t.replace(/_/g, ' ').toLowerCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: theme.spacing(1), marginBottom: theme.spacing(1) }}>
          {quicks.map(q => (
            <TouchableOpacity key={q.label} onPress={() => { setTask(q.task); setDuration(q.duration); setType(q.type); }} style={{ flex:1, flexDirection: 'row', alignItems: 'center', gap: theme.spacing(0.5), paddingVertical: theme.spacing(0.75), paddingHorizontal: theme.spacing(1), backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radius.md }}>
              <Feather name="zap" size={14} color={theme.colors.accent} />
              <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm }}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <PrimaryButton variant="solid" title="Salvar" onPress={() => addEntry({ task, durationMinutes: Number(duration), type })} />
      </View>
      <Text style={{ color: theme.colors.textSecondary, marginVertical: theme.spacing(2) }}>Resumo: {totalWork} min</Text>
      {Object.entries(byType).map(([k,v]) => <Text key={k} style={{ color: theme.colors.textPrimary }}>{k}: {v} min</Text>)}
  <Text style={{ color: theme.colors.textSecondary, marginVertical: theme.spacing(2) }}>Últimos registros</Text>
      {[...entries].sort((a, b) => {
        // Ordena do mais recente para o mais antigo
        const da = new Date(a.createdAt).getTime();
        const db = new Date(b.createdAt).getTime();
        return db - da;
      }).slice(0, 10).map(l => (
        <View key={l.id} style={{ padding: theme.spacing(1), marginBottom: theme.spacing(1), backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radius.sm }}>
          <Text style={{ color: theme.colors.textPrimary }}>{l.task} • {l.durationMinutes}m • {l.type}</Text>
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.xs, textAlign: 'center' }}>
            {(() => {
              let dateStr = l.createdAt;
              if (!dateStr) return '';
              // Se vier com 'Z', trata como UTC e exibe UTC
              if (dateStr.endsWith('Z')) {
                const d = new Date(dateStr);
                return isNaN(d.getTime()) ? '' : d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
              }
              // Se vier com milissegundos, remove
              if (dateStr.includes('.')) dateStr = dateStr.split('.')[0];
              // Se vier sem 'Z', monta como local mas exibe UTC
              const [datePart, timePart] = dateStr.split('T');
              if (!datePart || !timePart) return '';
              const [year, month, day] = datePart.split('-').map(Number);
              const [hour, min, sec] = timePart.split(':').map(Number);
              const d = new Date(Date.UTC(year, month - 1, day, hour, min, sec));
              return isNaN(d.getTime()) ? '' : d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
            })()}
          </Text>
        </View>
      ))}
    </ScreenContainer>
  );
};
