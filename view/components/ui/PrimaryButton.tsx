import React from 'react';
import { Pressable, Text, ViewStyle, TextStyle, View } from 'react-native';
import Gradient from './Gradient';
import { useTheme } from '../../../styles/ThemeContext';

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: 'solid' | 'gradient' | 'outline';
};

export default function PrimaryButton({ title, onPress, style, textStyle, disabled, variant = 'gradient' }: Props) {
  const { theme } = useTheme();
  const basePadY = theme.spacing(1.25);
  const basePadX = theme.spacing(3);
  const content = (
    <Text style={[{ color: theme.colors.buttonText, fontSize: theme.typography.sizes.md, fontFamily: theme.typography.fontFamily }, textStyle]}>{title}</Text>
  );
  return (
    <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled} style={({ pressed }) => [
      { opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
      style
    ]}>
      {variant === 'gradient' && (
        <Gradient colors={theme.gradients.accent} style={{ paddingVertical: basePadY, paddingHorizontal: basePadX, borderRadius: theme.radius.pill, alignItems: 'center' }}>
          {content}
        </Gradient>
      )}
      {variant === 'solid' && (
        <View style={{ backgroundColor: theme.colors.button, paddingVertical: basePadY, paddingHorizontal: basePadX, borderRadius: theme.radius.pill, alignItems: 'center' }}>
          {content}
        </View>
      )}
      {variant === 'outline' && (
        <View style={{ borderColor: theme.colors.button, borderWidth: 2, paddingVertical: basePadY, paddingHorizontal: basePadX, borderRadius: theme.radius.pill, alignItems: 'center' }}>
          <Text style={[{ color: theme.colors.button, fontSize: theme.typography.sizes.md, fontFamily: theme.typography.fontFamily }, textStyle]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
};
