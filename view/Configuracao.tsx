import React, { useState } from 'react';
import ScreenContainer from './components/ContainerTela';
import { Text, View, Pressable, Alert, TextInput } from 'react-native';
import { useWellbeing } from '../contexto/WellbeingContext';
import { useAuth } from '../contexto/AuthContext';
import { useTheme } from '../styles/ThemeContext';
import PrimaryButton from './components/ui/PrimaryButton';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Configuracao() {
  const { entries } = useWellbeing();
  const { session, updateUser, deleteAccount, loading } = useAuth();
  const { theme } = useTheme();
  const [name, setName] = useState(session?.user.name ?? '');
  const [email, setEmail] = useState(session?.user.email ?? '');
  const [senha, setSenha] = useState('');

  // Perfil evolutivo
  const total = entries.length;
  const avgMood = total ? (entries.reduce((a,b)=> a + b.mood,0)/ total).toFixed(2) : '0';
  // Supondo que interpretState está disponível
  let interp = { status_curto: '', mensagem: '', competencias: [] as string[] };
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    interp = require('../service/aiCoachService').interpretState(entries);
  } catch {}
  const statusColor = (s: string) => {
    switch (s) {
      case 'em alerta': return theme.colors.danger;
      case 'em recuperação': return theme.colors.orange;
      case 'em alta': return theme.colors.success;
      default: return theme.colors.textSecondary;
    }
  };

  const handleDeleteAccount = async () => {
    if (!session) return;
    Alert.alert('Excluir conta', 'Tem certeza que deseja excluir sua conta? Esta ação é irreversível.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        try {
          await deleteAccount();
        } catch (e) {
          Alert.alert('Erro', 'Não foi possível excluir a conta.');
        }
      } }
    ]);
  };

  return (
    <ScreenContainer title="Perfil & Configurações" subtitle="Seu retrato comportamental e dados">
      {/* Status interpretado */}
      <View style={{ backgroundColor: theme.colors.surface, padding: theme.spacing(2), borderRadius: theme.radius.lg, marginBottom: theme.spacing(2) }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing(1) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1) }}>
            <MaterialCommunityIcons name="brain" size={22} color={statusColor(interp.status_curto)} />
            <Text style={{ color: statusColor(interp.status_curto), fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.lg }}>
              {interp.status_curto?.toUpperCase()}
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
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm }}>Média de humor</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1), marginTop: theme.spacing(0.5) }}>
            <Feather name="smile" size={16} color={theme.colors.accentAlt} />
            <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.lg }}>{avgMood}</Text>
          </View>
        </View>
      </View>

      {/* Dados de perfil e edição */}
      <View style={{ backgroundColor: theme.colors.surface, padding: theme.spacing(2), borderRadius: theme.radius.lg, marginBottom: theme.spacing(2) }}>
        <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.typography.fontFamilyBold }}>Perfil</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Nome" placeholderTextColor={theme.colors.textSecondary} style={{ marginTop: theme.spacing(1), backgroundColor: theme.colors.surfaceAlt, color: theme.colors.textPrimary, padding: theme.spacing(1), borderRadius: theme.radius.md }} />
        <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="Email" placeholderTextColor={theme.colors.textSecondary} style={{ marginTop: theme.spacing(1), backgroundColor: theme.colors.surfaceAlt, color: theme.colors.textPrimary, padding: theme.spacing(1), borderRadius: theme.radius.md }} />
        <TextInput value={senha} onChangeText={setSenha} placeholder="Senha (obrigatória para atualizar)" placeholderTextColor={theme.colors.textSecondary} secureTextEntry style={{ marginTop: theme.spacing(1), backgroundColor: theme.colors.surfaceAlt, color: theme.colors.textPrimary, padding: theme.spacing(1), borderRadius: theme.radius.md }} />
        <PrimaryButton title={loading ? 'Salvando...' : 'Salvar perfil'} variant="solid" onPress={async () => {
          if (!senha) {
            Alert.alert('Atenção', 'Informe sua senha para atualizar o perfil.');
            return;
          }
          try {
            await updateUser({ name, email, senha });
            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
          } catch (e: any) {
            Alert.alert('Erro', e?.message || 'Não foi possível atualizar o perfil.');
          }
        }} style={{ marginTop: theme.spacing(1.25) }} />
        <Pressable onPress={handleDeleteAccount} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1), marginTop: theme.spacing(2), paddingVertical: theme.spacing(0.75), paddingHorizontal: theme.spacing(1), borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceAlt }}>
          <Feather name="user-x" size={16} color={theme.colors.danger} />
          <Text style={{ color: theme.colors.danger }}>Excluir conta</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
