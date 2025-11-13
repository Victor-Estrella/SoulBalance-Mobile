import React, { useState } from 'react';
import ScreenContainer from './components/ContainerTela';
import { View, Text, Pressable } from 'react-native';
import PrimaryButton from './components/ui/PrimaryButton';
import { useWellbeing } from '../contexto/WellbeingContext';
import { useTheme } from '../styles/ThemeContext';
import MoodSelector from './components/ui/MoodSelector';
import LevelChips from './components/ui/LevelChips';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

export default function BemEstar() {
  const { entries, addCheckin, simulate } = useWellbeing();
  const { theme } = useTheme();
  const [mood, setMood] = useState<number>(3);
  const [energy, setEnergy] = useState<number>(3);
  const [focus, setFocus] = useState<number>(3);
  return (
    <ScreenContainer title="Bem-estar">
      <Text style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing(1) }}>Novo Check-in</Text>

      <View style={{ padding: theme.spacing(1.5), backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, marginBottom: theme.spacing(1.5) }}>
        <Text style={{ color: theme.colors.textPrimary, marginBottom: theme.spacing(1) }}>Como você está agora?</Text>
        <MoodSelector value={mood} onChange={setMood} />

        <View style={{ height: theme.spacing(1.5) }} />
        <LevelChips label="Energia" value={energy} onChange={setEnergy} />
        <View style={{ height: theme.spacing(1) }} />
        <LevelChips label="Foco" value={focus} onChange={setFocus} />

        <View style={{ height: theme.spacing(1.5) }} />
        <View style={{ flexDirection: 'row', gap: theme.spacing(1) }}>
          <Pressable onPress={() => { setMood(2); setEnergy(2); setFocus(2); }} style={{ paddingVertical: theme.spacing(0.75), paddingHorizontal: theme.spacing(1.5), backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radius.pill }}>
            <Text style={{ color: theme.colors.textSecondary }}>Cansado</Text>
          </Pressable>
          <Pressable onPress={() => { setMood(4); setEnergy(5); setFocus(5); }} style={{ paddingVertical: theme.spacing(0.75), paddingHorizontal: theme.spacing(1.5), backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radius.pill }}>
            <Text style={{ color: theme.colors.textSecondary }}>Pico de foco</Text>
          </Pressable>
          <Pressable onPress={() => { setMood(3); setEnergy(3); setFocus(3); }} style={{ paddingVertical: theme.spacing(0.75), paddingHorizontal: theme.spacing(1.5), backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radius.pill }}>
            <Text style={{ color: theme.colors.textSecondary }}>Neutro</Text>
          </Pressable>
        </View>

        <View style={{ height: theme.spacing(1.5) }} />
        <PrimaryButton variant="solid" title="Salvar check-in" onPress={() => addCheckin({ mood, energy, focus })} />
        <View style={{ height: theme.spacing(1) }} />
        <PrimaryButton variant="outline" title="Simular sensores" onPress={simulate} />
      </View>

      <Text style={{ color: theme.colors.textSecondary, marginVertical: theme.spacing(2) }}>Últimos check-ins</Text>
      {entries.slice(0, 10).map((e) => {
        const moodLabel = (n: number) => ['Péssimo', 'Ruim', 'Ok', 'Bem', 'Ótimo'][n - 1] || '—';
        const moodIcon = (n: number) =>
          [
            'emoticon-dead-outline',
            'emoticon-sad-outline',
            'emoticon-neutral-outline',
            'emoticon-happy-outline',
            'emoticon-excited-outline',
          ][n - 1] as any;
        const moodColor = (n: number) =>
          n === 1
            ? theme.colors.danger
            : n === 2
            ? theme.colors.orange
            : n === 3
            ? theme.colors.textSecondary
            : n === 4
            ? theme.colors.accentAlt
            : theme.colors.success;
        const sourceLabel = e.source === 'simulated' ? 'Sensores' : 'Manual';

        return (
          <View
            key={e.id}
            style={{
              padding: theme.spacing(1),
              marginBottom: theme.spacing(1),
              backgroundColor: theme.colors.surfaceAlt,
              borderRadius: theme.radius.md,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1), marginBottom: theme.spacing(0.5) }}>
              <MaterialCommunityIcons name={moodIcon(e.mood)} size={20} color={moodColor(e.mood)} />
              <Text style={{ color: moodColor(e.mood), fontWeight: '600' }}>{moodLabel(e.mood)}</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: theme.spacing(1), marginBottom: theme.spacing(0.5) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(0.5), paddingVertical: theme.spacing(0.25), paddingHorizontal: theme.spacing(0.75), backgroundColor: theme.colors.surface, borderRadius: theme.radius.pill }}>
                <Feather name="zap" size={12} color={theme.colors.textSecondary} />
                <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.sm }}>Energia {e.energy}/5</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(0.5), paddingVertical: theme.spacing(0.25), paddingHorizontal: theme.spacing(0.75), backgroundColor: theme.colors.surface, borderRadius: theme.radius.pill }}>
                <Feather name="target" size={12} color={theme.colors.textSecondary} />
                <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.sm }}>Foco {e.focus}/5</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(0.5), paddingVertical: theme.spacing(0.25), paddingHorizontal: theme.spacing(0.75), backgroundColor: theme.colors.surface, borderRadius: theme.radius.pill }}>
                <Feather name="cpu" size={12} color={theme.colors.textSecondary} />
                <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm }}>{sourceLabel}</Text>
              </View>
            </View>

            <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.xs }}>
              {new Date(e.createdAt).toLocaleTimeString()}
            </Text>
          </View>
        );
      })}
    </ScreenContainer>
  );
};
