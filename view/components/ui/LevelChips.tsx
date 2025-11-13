import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../../styles/ThemeContext';

type LevelChipsProps = {
  label: string;
  value: number; // 1-5
  onChange: (v: number) => void;
};

export default function LevelChips({ label, value, onChange }: LevelChipsProps) {
  const { theme } = useTheme();
  const levels = [1, 2, 3, 4, 5];
  const chipColor = (lvl: number) => {
    if (lvl <= 2) return theme.colors.warning;
    if (lvl === 3) return theme.colors.textSecondary;
    if (lvl === 4) return theme.colors.accentAlt;
    return theme.colors.success;
  };

  return (
    <View>
      <Text style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing(0.5) }}>{label}</Text>
      <View style={{ flexDirection: 'row', gap: theme.spacing(1) }}>
        {levels.map((lvl) => {
          const selected = value === lvl;
          const c = chipColor(lvl);
          return (
            <Pressable
              key={lvl}
              accessibilityRole="button"
              onPress={() => onChange(lvl)}
              style={{
                paddingVertical: theme.spacing(0.5),
                paddingHorizontal: theme.spacing(1.25),
                borderRadius: theme.radius.pill,
                borderWidth: 1,
                borderColor: selected ? c : theme.colors.border,
                backgroundColor: selected ? theme.colors.surfaceAlt : 'transparent',
              }}
            >
              <Text style={{ color: selected ? c : theme.colors.textSecondary }}>{lvl}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
