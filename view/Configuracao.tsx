import React, { useEffect, useState } from 'react';
import ScreenContainer from './components/ContainerTela';
import { Text, View, Switch, Pressable, Alert, TextInput } from 'react-native';
import { useTheme } from '../styles/ThemeContext';
import { useWellbeing } from '../contexto/WellbeingContext';
import { useLogs } from '../contexto/LogContext';
import PrimaryButton from './components/ui/PrimaryButton';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../contexto/AuthContext';

export default function Configuracao() {
  const { theme } = useTheme();
  const { entries, refresh: refreshWellbeing, simulate, clearAll: clearWellbeing } = useWellbeing();
  const { logs, clearAll: clearLogsAll } = useLogs();
  const { session, updateUser, deleteAccount } = useAuth();

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
  const [name, setName] = useState(session?.user.name ?? '');
  const [email, setEmail] = useState(session?.user.email ?? '');
  const [senha, setSenha] = useState('');
  const [autoSimulate, setAutoSimulate] = useState<boolean>(false);

  useEffect(() => {
    if (!autoSimulate) return;
    const id = setInterval(() => {
      simulate();
    }, 60000);
    return () => clearInterval(id);
  }, [autoSimulate, simulate]);

  const handleClearData = () => {
    if (!session) return;
    Alert.alert('Limpar dados', 'Isso removerá seus check-ins e registros. Continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => {
        clearWellbeing();
        clearLogsAll();
        refreshWellbeing();
      } }
    ]);
  };

  return (
    <ScreenContainer title="Configurações" subtitle="Perfil e dados">
      <View style={{ backgroundColor: theme.colors.surface, padding: theme.spacing(2), borderRadius: theme.radius.lg, marginBottom: theme.spacing(2) }}>
        <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.typography.fontFamilyBold }}>Perfil</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Nome" placeholderTextColor={theme.colors.textSecondary} style={{ marginTop: theme.spacing(1), backgroundColor: theme.colors.surfaceAlt, color: theme.colors.textPrimary, padding: theme.spacing(1), borderRadius: theme.radius.md }} />
        <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="Email" placeholderTextColor={theme.colors.textSecondary} style={{ marginTop: theme.spacing(1), backgroundColor: theme.colors.surfaceAlt, color: theme.colors.textPrimary, padding: theme.spacing(1), borderRadius: theme.radius.md }} />
        <TextInput value={senha} onChangeText={setSenha} placeholder="Senha (obrigatória para atualizar)" placeholderTextColor={theme.colors.textSecondary} secureTextEntry style={{ marginTop: theme.spacing(1), backgroundColor: theme.colors.surfaceAlt, color: theme.colors.textPrimary, padding: theme.spacing(1), borderRadius: theme.radius.md }} />
        <PrimaryButton title="Salvar perfil" variant="solid" onPress={async () => {
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

      <View style={{ backgroundColor: theme.colors.surface, padding: theme.spacing(2), borderRadius: theme.radius.lg, marginBottom: theme.spacing(2) }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.typography.fontFamilyBold }}>Simulação</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1) }}>
            <Text style={{ color: theme.colors.textSecondary, marginRight: theme.spacing(0.5) }}>Auto simular</Text>
            <Switch value={autoSimulate} onValueChange={setAutoSimulate} />
          </View>
        </View>
        <Text style={{ color: theme.colors.textSecondary, marginTop: theme.spacing(1) }}>Gera check-ins automáticos a cada 60s enquanto ativo.</Text>
      </View>

      <View style={{ backgroundColor: theme.colors.surface, padding: theme.spacing(2), borderRadius: theme.radius.lg, marginBottom: theme.spacing(2) }}>
        <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.typography.fontFamilyBold }}>Dados</Text>
        <Text style={{ color: theme.colors.textSecondary, marginTop: theme.spacing(1) }}>Check-ins: {entries.length} • Registros: {logs.length}</Text>
        <Pressable onPress={handleClearData} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1), marginTop: theme.spacing(1.5), paddingVertical: theme.spacing(0.75), paddingHorizontal: theme.spacing(1), borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceAlt }}>
          <Feather name="trash-2" size={16} color={theme.colors.danger} />
          <Text style={{ color: theme.colors.danger }}>Limpar dados</Text>
        </Pressable>
      </View>

      {/* Seção de exportação removida conforme solicitado */}
    </ScreenContainer>
  );
};