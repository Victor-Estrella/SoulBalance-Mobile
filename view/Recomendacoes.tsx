import React, { useMemo, useState } from 'react';
import ScreenContainer from './components/ContainerTela';
import { View, Text, TouchableOpacity } from 'react-native';
import { useWellbeing } from '../contexto/WellbeingContext';
import { useAuth } from '../contexto/AuthContext';
import { useRecommendations } from '../control/useRecommendations';
import { useTheme } from '../styles/ThemeContext';

export default function Recomendacoes() {
  const { entries } = useWellbeing();
  const { session } = useAuth();
  const { metrics, recs, isLoadingAI } = useRecommendations(session?.user.id || 'nouser', entries);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const aiRecs = useMemo(() => recs.filter(r => r.origin === 'ai'), [recs]);
  const ruleRecs = useMemo(() => recs.filter(r => r.origin !== 'ai'), [recs]);
  const { theme } = useTheme();
  const [showFullReport, setShowFullReport] = useState(false);

  const stripMarkdown = (text: string) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1');

  return (
    <ScreenContainer title="Recomendações">
      <Text style={{ color: theme.colors.textSecondary }}>Métricas</Text>
      <Text style={{ color: theme.colors.textPrimary }}>Fadiga: {metrics.fatigueIndex} • Stress: {metrics.stressLevel} • Recuperação: {metrics.recoveryIndex}</Text>
      <Text style={{ color: theme.colors.textSecondary, marginVertical: theme.spacing(2) }}>Sugestões</Text>
      {isLoadingAI && (
        <Text style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing(1) }}>
          Gerando recomendações com a IA...
        </Text>
      )}
      {aiRecs.length > 0 && (
        <View style={{ marginBottom: theme.spacing(2) }}>
          {/* Destaque principal do SoulBalance AI */}
          {(() => {
            const focusRec = aiRecs.find(r => r.category === 'focus');
            const prodRec = aiRecs.find(r => r.category === 'productivity');
            const careRecs = aiRecs.filter(r => r.category === 'health').slice(0, 2);
            if (!focusRec && !prodRec && careRecs.length === 0) return null;
            return (
              <View style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                padding: theme.spacing(1.5),
                marginBottom: theme.spacing(2),
                borderWidth: 1,
                borderColor: theme.colors.accent,
              }}>
                <Text style={{ color: theme.colors.accent, fontSize: theme.typography.sizes.sm, marginBottom: theme.spacing(0.5) }}>
                  SoulBalance AI - Resumo do dia
                </Text>
                {focusRec && (
                  <Text style={{ color: theme.colors.textPrimary, marginBottom: theme.spacing(0.75) }}>
                    {stripMarkdown(focusRec.message.replace(/^Diagnóstico:\s*/i, ''))}
                  </Text>
                )}
                {prodRec && (
                  <Text style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing(0.75), fontSize: theme.typography.sizes.sm }}>
                    {stripMarkdown(prodRec.message)}
                  </Text>
                )}
                {careRecs.length > 0 && (
                  <View style={{ marginTop: theme.spacing(0.5) }}>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.xs, marginBottom: theme.spacing(0.25) }}>
                      Autocuidado sugerido:
                    </Text>
                    {careRecs.map((r, idx) => (
                      <Text
                        key={r.id}
                        style={{
                          color: theme.colors.textPrimary,
                          fontSize: theme.typography.sizes.xs,
                          marginLeft: theme.spacing(1),
                        }}
                      >
                        {idx + 1}. {stripMarkdown(r.message)}
                      </Text>
                    ))}
                    {/* Botão de relatório completo pode ser reativado quando rawText estiver disponível */}
                  </View>
                )}
              </View>
            );
          })()}

          <Text style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing(1) }}>Geradas pela IA (detalhadas)</Text>
          {aiRecs.map(r => (
            <TouchableOpacity
              key={r.id}
              activeOpacity={0.85}
              onPress={() => setExpandedId(expandedId === r.id ? null : r.id)}
              style={{ backgroundColor: theme.colors.surfaceAlt, padding: theme.spacing(1), borderRadius: theme.radius.md, marginBottom: theme.spacing(1) }}
            >
              <Text style={{ color: theme.colors.accent, fontSize: theme.typography.sizes.sm }}>{r.category.toUpperCase()} ({r.score})</Text>
              <Text style={{ color: theme.colors.textPrimary }}>{stripMarkdown(r.message)}</Text>
              {expandedId === r.id && (
                <Text style={{ color: theme.colors.textSecondary, marginTop: theme.spacing(0.5), fontSize: theme.typography.sizes.xs }}>
                  Fonte IA (debug): {r.origin === 'ai' ? 'ok' : 'regra'}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showFullReport && false && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000000AA',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.surface,
              padding: theme.spacing(2),
              margin: theme.spacing(2),
              borderRadius: theme.radius.lg,
              maxHeight: '80%',
            }}
          >
            <Text
              style={{
                color: theme.colors.textPrimary,
                marginBottom: theme.spacing(1),
                fontSize: theme.typography.sizes.sm,
              }}
            >
              Relatório completo da SoulBalance AI
            </Text>
            <Text
              style={{
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing(1),
                fontSize: theme.typography.sizes.xs,
              }}
            >
              {/* Conteúdo completo da IA entraria aqui */}
            </Text>
            <TouchableOpacity
              onPress={() => setShowFullReport(false)}
              style={{
                alignSelf: 'flex-end',
                paddingHorizontal: theme.spacing(1.5),
                paddingVertical: theme.spacing(0.5),
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.accent,
              }}
            >
              <Text style={{ color: theme.colors.buttonText, fontSize: theme.typography.sizes.xs }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {ruleRecs.map(r => (
        <TouchableOpacity
          key={r.id}
          activeOpacity={0.85}
          onPress={() => setExpandedId(expandedId === r.id ? null : r.id)}
          style={{ backgroundColor: theme.colors.surfaceAlt, padding: theme.spacing(1), borderRadius: theme.radius.md, marginBottom: theme.spacing(1) }}
        >
          <Text style={{ color: theme.colors.accentAlt, fontSize: theme.typography.sizes.sm }}>{r.category.toUpperCase()} ({r.score})</Text>
          <Text style={{ color: theme.colors.textPrimary }}>{r.message}</Text>
          {expandedId === r.id && (
            <Text style={{ color: theme.colors.textSecondary, marginTop: theme.spacing(0.5), fontSize: theme.typography.sizes.xs }}>
              Origem: regra
            </Text>
          )}
        </TouchableOpacity>
      ))}
      {recs.length === 0 && <Text style={{ color: theme.colors.textSecondary }}>Sem recomendações ainda.</Text>}
    </ScreenContainer>
  );
};