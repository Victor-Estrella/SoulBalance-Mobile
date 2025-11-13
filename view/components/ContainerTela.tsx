import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Gradient from './ui/Gradient';
import { useTheme } from '../../styles/ThemeContext';

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onLogout?: () => void;
};

export default function ScreenContainer({ title, subtitle, children, onLogout }: Props) {
  const { theme } = useTheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} accessibilityLabel={title}>
      <Gradient colors={theme.gradients.hero} style={{ paddingHorizontal: theme.spacing(2), paddingTop: theme.spacing(5), paddingBottom: theme.spacing(3), borderBottomLeftRadius: theme.radius.lg, borderBottomRightRadius: theme.radius.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.display, fontFamily: theme.typography.displayFamily }}>{title}</Text>
            {!!subtitle && <Text style={{ color: theme.colors.textSecondary, marginTop: theme.spacing(0.5) }}>{subtitle}</Text>}
          </View>
          {onLogout && (
            <TouchableOpacity accessibilityRole="button" onPress={onLogout} style={{ padding: theme.spacing(1), borderRadius: theme.radius.pill, borderWidth: 1, borderColor: theme.colors.button }}>
              <Feather name="log-out" size={18} color={theme.colors.button} />
            </TouchableOpacity>
          )}
        </View>
      </Gradient>
      <View style={{ padding: theme.spacing(2) }}>
        {children}
      </View>
    </ScrollView>
  );
};
