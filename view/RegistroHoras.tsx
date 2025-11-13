import React, { useState } from 'react';
import ScreenContainer from './components/ContainerTela';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import PrimaryButton from './components/ui/PrimaryButton';
import { useTheme } from '../styles/ThemeContext';
import { useLogs } from '../contexto/LogContext';
import { Feather } from '@expo/vector-icons';
import { TipoAtividade } from '../model/types';

export default function RegistroHoras() {
  const { addEntry, logs, totalWork, byType } = useLogs();
  const { theme } = useTheme();
  const [task, setTask] = useState('Tarefa');
  const [duration, setDuration] = useState('30');
  const [type, setType] = useState<TipoAtividade>(TipoAtividade.DEEPWORK);
  const quicks = [
    { label: 'Focus 25m', task: 'Deep Focus', duration: '25', type: TipoAtividade.DEEPWORK },
    { label: 'Revisão 15m', task: 'Code Review', duration: '15', type: TipoAtividade.CREATIVE },
    { label: 'Estudo 40m', task: 'Learning', duration: '40', type: TipoAtividade.LEARNING },
  ];
  return (
    <ScreenContainer title="Registro de Horas">
      <Text style={{ color: theme.colors.textSecondary }}>Novo registro</Text>
      <View style={{ backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing(1.5), marginVertical: theme.spacing(1) }}>
        <TextInput value={task} onChangeText={setTask} style={{ backgroundColor: theme.colors.surfaceAlt, color: theme.colors.textPrimary, padding: theme.spacing(1), borderRadius: theme.radius.sm, marginBottom: theme.spacing(1) }} placeholder="Tarefa" placeholderTextColor={theme.colors.textSecondary} />
        <TextInput value={duration} keyboardType="numeric" onChangeText={setDuration} style={{ backgroundColor: theme.colors.surfaceAlt, color: theme.colors.textPrimary, padding: theme.spacing(1), borderRadius: theme.radius.sm, marginBottom: theme.spacing(1) }} placeholder="Minutos" placeholderTextColor={theme.colors.textSecondary} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(1), marginBottom: theme.spacing(1) }}>
          {[TipoAtividade.CREATIVE, TipoAtividade.SOFTSKILL, TipoAtividade.DEEPWORK, TipoAtividade.LEARNING].map(t => (
            <TouchableOpacity key={t} onPress={() => setType(t)} style={{ paddingVertical: theme.spacing(0.75), paddingHorizontal: theme.spacing(2), borderWidth: 1, borderColor: type === t ? theme.colors.accent : theme.colors.border, backgroundColor: type === t ? theme.colors.accent : 'transparent', borderRadius: theme.radius.pill }}>
              <Text style={{ color: type === t ? theme.colors.white : theme.colors.textSecondary, fontSize: theme.typography.sizes.sm }}>{t.toLowerCase() }</Text>
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
      {logs.slice(0,10).map(l => (
        <View key={l.id} style={{ padding: theme.spacing(1), marginBottom: theme.spacing(1), backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radius.sm }}>
          <Text style={{ color: theme.colors.textPrimary }}>{l.task} • {l.durationMinutes}m • {l.type}</Text>
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.xs }}>{new Date(l.createdAt).toLocaleTimeString()}</Text>
        </View>
      ))}
    </ScreenContainer>
  );
};
