import React, { useMemo } from 'react';
import ScreenContainer from './components/ContainerTela';
import { View, Text } from 'react-native';
import { useWellbeing } from '../contexto/WellbeingContext';
import { useAuth } from '../contexto/AuthContext';
import { useRecommendations } from '../control/useRecommendations';
import { useTheme } from '../styles/ThemeContext';
// AI recommendations are fetched inside useRecommendations now

export default function Recomendacoes() {
  const { entries } = useWellbeing();
  const { session } = useAuth();
  const { metrics, recs } = useRecommendations(session?.user.id || 'nouser', entries);
  const aiRecs = useMemo(() => recs.filter(r => r.origin === 'ai'), [recs]);
  const ruleRecs = useMemo(() => recs.filter(r => r.origin !== 'ai'), [recs]);
  const { theme } = useTheme();
  return (
    <ScreenContainer title="Recomendações">
      <Text style={{ color: theme.colors.textSecondary }}>Métricas</Text>
      <Text style={{ color: theme.colors.textPrimary }}>Fadiga: {metrics.fatigueIndex} • Stress: {metrics.stressLevel} • Recuperação: {metrics.recoveryIndex}</Text>
      <Text style={{ color: theme.colors.textSecondary, marginVertical: theme.spacing(2) }}>Sugestões</Text>
      {aiRecs.length > 0 && (
        <View style={{ marginBottom: theme.spacing(2) }}>
          <Text style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing(1) }}>Geradas pela IA</Text>
          {aiRecs.map(r => (
            <View key={r.id} style={{ backgroundColor: theme.colors.surfaceAlt, padding: theme.spacing(1), borderRadius: theme.radius.md, marginBottom: theme.spacing(1) }}>
              <Text style={{ color: theme.colors.accent, fontSize: theme.typography.sizes.sm }}>{r.category.toUpperCase()} ({r.score})</Text>
              <Text style={{ color: theme.colors.textPrimary }}>{r.message}</Text>
            </View>
          ))}
        </View>
      )}

      {ruleRecs.map(r => (
        <View key={r.id} style={{ backgroundColor: theme.colors.surfaceAlt, padding: theme.spacing(1), borderRadius: theme.radius.md, marginBottom: theme.spacing(1) }}>
          <Text style={{ color: theme.colors.accentAlt, fontSize: theme.typography.sizes.sm }}>{r.category.toUpperCase()} ({r.score})</Text>
          <Text style={{ color: theme.colors.textPrimary }}>{r.message}</Text>
        </View>
      ))}
      {recs.length === 0 && <Text style={{ color: theme.colors.textSecondary }}>Sem recomendações ainda.</Text>}
    </ScreenContainer>
  );
};