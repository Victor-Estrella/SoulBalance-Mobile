import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../../styles/ThemeContext';

type Props = { label: string; focused: boolean; color: string };

export default function TabIcon({ label, focused, color }: Props) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? theme.colors.surfaceAlt : 'transparent',
      }}
    >
      <Text style={{ color, fontSize: 16 }}>{label}</Text>
    </View>
  );
};
