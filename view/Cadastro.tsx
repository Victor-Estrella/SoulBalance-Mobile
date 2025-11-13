import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexto/AuthContext';
import { useTheme } from '../styles/ThemeContext';
import ScreenContainer from './components/ContainerTela';
import PrimaryButton from './components/ui/PrimaryButton';
import FormField from './components/ui/FormField';

type Props = { goLogin: () => void };

export default function Cadastro({ goLogin }: Props) {
  const { signup, loading } = useAuth();
  const { theme } = useTheme();
  const [name, setName] = useState('Demo');
  const [email, setEmail] = useState('demo@soul.app');
  const [password, setPassword] = useState('123456');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  return (
    <ScreenContainer title="Criar Conta" subtitle="Comece seu equilíbrio com a gente">
      <View style={{ backgroundColor: theme.colors.surface, padding: theme.spacing(2), borderRadius: theme.radius.lg }}>
        <FormField label="Nome" value={name} onChange={setName} placeholder="Seu nome" icon="user" error={errors.name} autoCapitalize="words" />
        <FormField label="Email" value={email} onChange={setEmail} placeholder="seu@email.com" icon="mail" keyboardType="email-address" error={errors.email} />
        <FormField label="Senha" value={password} onChange={setPassword} placeholder="••••••" secure icon="lock" error={errors.password} />
        <PrimaryButton
          variant="gradient"
          title={loading ? 'Criando...' : 'Criar conta'}
          onPress={() => {
            const next: any = {};
            if (!name.trim()) next.name = 'Informe seu nome';
            if (!email.includes('@')) next.email = 'Email inválido';
            if (password.length < 6) next.password = 'Use ao menos 6 caracteres';
            setErrors(next);
            if (Object.keys(next).length === 0) signup(name, email, password);
          }}
        />
        <TouchableOpacity accessibilityRole="button" onPress={goLogin} style={{ marginTop: theme.spacing(2), alignSelf: 'center' }}>
          <Text style={{ color: theme.colors.accent }}>Já tenho conta</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};
