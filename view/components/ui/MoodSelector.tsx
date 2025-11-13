import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../../styles/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type MoodSelectorProps = {
  value: number; // 1-5
  onChange: (v: number) => void;
};

  const moods = [
    { key: 1, icon: 'emoticon-dead-outline' as const, label: 'Péssimo' },
    { key: 2, icon: 'emoticon-sad-outline' as const, label: 'Ruim' },
    { key: 3, icon: 'emoticon-neutral-outline' as const, label: 'Ok' },
    { key: 4, icon: 'emoticon-happy-outline' as const, label: 'Bem' },
    { key: 5, icon: 'emoticon-excited-outline' as const, label: 'Ótimo' },
  ];

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  const { theme } = useTheme();

  const colorFor = (k: number) => {
    if (k === 1) return theme.colors.danger; // Péssimo
    if (k === 2) return theme.colors.orange; // Ruim
    if (k === 3) return theme.colors.textSecondary; // Ok
    if (k === 4) return theme.colors.accentAlt; // Bem
    return theme.colors.success; // Ótimo
  };

  return (
    <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing(1) }}>
      {moods.map((m) => {
        const selected = value === m.key;
        const c = colorFor(m.key);
        return (
          <Pressable
            key={m.key}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(m.key)}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: theme.spacing(1),
              backgroundColor: selected ? theme.colors.surfaceAlt : 'transparent',
              borderRadius: theme.radius.md,
              borderWidth: selected ? 1 : 0,
              borderColor: c,
            }}
          >
            <MaterialCommunityIcons name={m.icon} size={24} color={c} />
            <Text style={{ color: c, fontSize: theme.typography.sizes.sm }}>{m.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
