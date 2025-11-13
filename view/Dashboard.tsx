import React, { useMemo } from 'react';
import ScreenContainer from './components/ContainerTela';
import { Text, View } from 'react-native';
import HeroCard from './components/ui/HeroCard';
import { useTheme } from '../styles/ThemeContext';
import { useAuth } from '../contexto/AuthContext';
import { useWellbeing } from '../contexto/WellbeingContext';
import { interpretState, generateDailyPlan } from '../service/aiCoachService';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { theme } = useTheme();
  const { session } = useAuth();
  const { entries } = useWellbeing();
  const interpretation = useMemo(() => interpretState(entries), [entries]);
  const todaysPlan = useMemo(() => generateDailyPlan(entries), [entries]);

  const colorStatus = (status: string) => {
    switch (status) {
      case 'em alerta': return theme.colors.danger;
      case 'em recuperação': return theme.colors.orange;
      case 'em alta': return theme.colors.success;
      default: return theme.colors.textSecondary;
    }
  };

  return (
  <ScreenContainer title="Dashboard" subtitle="Seu equilíbrio hoje" onLogout={onLogout}>
      <HeroCard
        title={`Olá, ${session?.user.name}`}
        subtitle="Vamos equilibrar performance e recuperação"
        image={require('../assets/splash-icon.png')}
        imageSize={56}
        tintColor={theme.colors.white}
      />
      <View style={{ backgroundColor: theme.colors.surface, padding: theme.spacing(2), borderRadius: theme.radius.lg, marginBottom: theme.spacing(2) }}>
        <Text style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing(1) }}>Status interpretado</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1), marginBottom: theme.spacing(1) }}>
          <MaterialCommunityIcons name="brain" size={22} color={colorStatus(interpretation.status_curto)} />
          <Text style={{ color: colorStatus(interpretation.status_curto), fontWeight: '600' }}>{interpretation.status_curto.toUpperCase()}</Text>
        </View>
        <Text style={{ color: theme.colors.textPrimary }}>{interpretation.mensagem}</Text>
        {interpretation.competencias.length > 0 && (
          <Text style={{ color: theme.colors.textSecondary, marginTop: theme.spacing(1), fontSize: theme.typography.sizes.sm }}>
            Competências: {interpretation.competencias.join(', ')}
          </Text>
        )}
      </View>

      <View style={{ backgroundColor: theme.colors.surface, padding: theme.spacing(2), borderRadius: theme.radius.lg }}>
        <Text style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing(1) }}>Plano do Dia</Text>
        {todaysPlan.itens.map(item => (
          <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1), paddingVertical: theme.spacing(0.75) }}>
            <Feather name={iconFor(item.tipo)} size={16} color={theme.colors.accentAlt} />
            <View style={{ flex:1 }}>
              <Text style={{ color: theme.colors.textPrimary }}>{item.titulo}</Text>
              {item.detalhes && <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.xs }}>{item.detalhes}</Text>}
            </View>
            {item.duracaoMin && (
              <View style={{ paddingHorizontal: theme.spacing(1), paddingVertical: theme.spacing(0.5), backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radius.pill }}>
                <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.xs }}>{item.duracaoMin}m</Text>
              </View>
            )}
          </View>
        ))}
        {todaysPlan.itens.length === 0 && <Text style={{ color: theme.colors.textSecondary }}>Sem itens hoje.</Text>}
      </View>
    </ScreenContainer>
  );
};

function iconFor(tipo: string) {
  switch (tipo) {
    case 'pausa': return 'coffee';
    case 'micro-missao': return 'target';
    case 'meditacao': return 'wind';
    case 'mensagem': return 'message-circle';
    case 'planejamento': return 'calendar';
    default: return 'circle';
  }
}