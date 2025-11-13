import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Gradient from './ui/Gradient';
import { useTheme } from '../../styles/ThemeContext';
import { useAuth } from '../../contexto/AuthContext';

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onLogout?: () => void;
};

export default function ScreenContainer({ title, subtitle, children, onLogout }: Props) {
  const { theme } = useTheme();
  const { logout, session } = useAuth();

  const handleLogout = onLogout || logout;
  const showLogout = !!session;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} accessibilityLabel={title}>
      <Gradient
        colors={theme.gradients.hero}
        style={{
          paddingHorizontal: theme.spacing(2),
          paddingTop: theme.spacing(5),
          paddingBottom: theme.spacing(3),
          borderBottomLeftRadius: theme.radius.lg,
          borderBottomRightRadius: theme.radius.lg,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.accent,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, paddingRight: theme.spacing(1) }}>
            <Text
              style={{
                color: theme.colors.textPrimary,
                fontSize: theme.typography.sizes.display,
                fontFamily: theme.typography.displayFamily,
                letterSpacing: 0.5
              }}
            >
              {title}
            </Text>
            {!!subtitle && (
              <Text
                style={{
                  color: theme.colors.textSecondary,
                  marginTop: theme.spacing(0.5),
                  fontSize: theme.typography.sizes.sm
                }}
              >
                {subtitle}
              </Text>
            )}
          </View>
          {showLogout && (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Logout"
              onPress={handleLogout}
              style={{
                paddingVertical: theme.spacing(0.75),
                paddingHorizontal: theme.spacing(1.25),
                borderRadius: theme.radius.pill,
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing(0.5),
                backgroundColor: theme.colors.accent,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 2 }
              }}
            >
              <Feather name="log-out" size={16} color={theme.colors.white} />
              <Text style={{ color: theme.colors.white, fontSize: theme.typography.sizes.sm }}>Sair</Text>
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
