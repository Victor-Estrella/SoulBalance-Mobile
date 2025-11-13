import React, { useMemo } from 'react';
import ScreenContainer from './components/ContainerTela';
import { Text, View } from 'react-native';
import { useWellbeing } from '../contexto/WellbeingContext';
import { useAuth } from '../contexto/AuthContext';
import { useTheme } from '../styles/ThemeContext';
import { interpretState } from '../service/aiCoachService';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';


export default function Profile () {
  const { entries } = useWellbeing();
  const { session } = useAuth();
  const { theme } = useTheme();
  const total = entries.length;
  const avgMood = total ? (entries.reduce((a,b)=> a + b.mood,0)/ total).toFixed(2) : '0';
  const interp = useMemo(() => interpretState(entries), [entries]);

  const statusColor = (s: string) => {
    switch (s) {
      case 'em alerta': return theme.colors.danger;
      case 'em recuperação': return theme.colors.orange;
      case 'em alta': return theme.colors.success;
      default: return theme.colors.textSecondary;
    }
  };

  return (
    <ScreenContainer title="Perfil Evolutivo" subtitle="Seu retrato comportamental">
      {/* Status interpretado */}
      <View style={{ backgroundColor: theme.colors.surface, padding: theme.spacing(2), borderRadius: theme.radius.lg, marginBottom: theme.spacing(2) }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing(1) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1) }}>
            <MaterialCommunityIcons name="brain" size={22} color={statusColor(interp.status_curto)} />
            <Text style={{ color: statusColor(interp.status_curto), fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.lg }}>
              {interp.status_curto.toUpperCase()}
            </Text>
          </View>
          <Text style={{ color: theme.colors.textSecondary }}>{session?.user.name}</Text>
        </View>
        <Text style={{ color: theme.colors.textPrimary }}>{interp.mensagem}</Text>
        {interp.competencias.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(1), marginTop: theme.spacing(1.5) }}>
            {interp.competencias.map((c) => (
              <View key={c} style={{ paddingVertical: theme.spacing(0.5), paddingHorizontal: theme.spacing(1), backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radius.pill }}>
                <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm }}>{c}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Métricas rápidas */}
      <View style={{ flexDirection: 'row', gap: theme.spacing(2), marginBottom: theme.spacing(2) }}>
        <View style={{ flex: 1, backgroundColor: theme.colors.surfaceAlt, padding: theme.spacing(1.5), borderRadius: theme.radius.md }}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm }}>Check-ins</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1), marginTop: theme.spacing(0.5) }}>
            <Feather name="clipboard" size={16} color={theme.colors.accentAlt} />
            <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.lg }}>{total}</Text>
          </View>
        </View>
        <View style={{ flex: 1, backgroundColor: theme.colors.surfaceAlt, padding: theme.spacing(1.5), borderRadius: theme.radius.md }}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm }}>Humor médio</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1), marginTop: theme.spacing(0.5) }}>
            <MaterialCommunityIcons name="emoticon-outline" size={18} color={theme.colors.accent} />
            <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.lg }}>{avgMood}</Text>
          </View>
        </View>
      </View>

      {/* Ajuda contextual */}
      <View style={{ backgroundColor: theme.colors.surface, padding: theme.spacing(1.5), borderRadius: theme.radius.md }}>
        <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm }}>
          Este perfil é atualizado automaticamente conforme seus check-ins e recomendações.
        </Text>
      </View>
    </ScreenContainer>
  );
};
