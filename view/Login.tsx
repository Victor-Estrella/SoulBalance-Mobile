import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PrimaryButton from './components/ui/PrimaryButton';
import { useAuth } from '../contexto/AuthContext';
import { useTheme } from '../styles/ThemeContext';
import ScreenContainer from './components/ContainerTela';
import FormField from './components/ui/FormField';

type Props = { goSignup: () => void; onLogged: () => void };

export default function Login({ goSignup, onLogged }: Props) {
  const { login, loading, session } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState('demo@soul.app');
  const [password, setPassword] = useState('123456');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  React.useEffect(() => { if (session) onLogged(); }, [session]);
  return (
    <ScreenContainer title="Login" subtitle="Acesse sua jornada de equilíbrio">
      <View style={{ backgroundColor: theme.colors.surface, padding: theme.spacing(2), borderRadius: theme.radius.lg }}>
        <FormField label="Email" value={email} onChange={setEmail} placeholder="seu@email.com" keyboardType="email-address" icon="mail" error={errors.email} />
        <FormField label="Senha" value={password} onChange={setPassword} placeholder="••••••" secure icon="lock" error={errors.password} />
        <PrimaryButton
          variant="gradient"
          title={loading ? 'Entrando...' : 'Entrar'}
          onPress={() => {
            const next: any = {};
            if (!email.includes('@')) next.email = 'Email inválido';
            if (password.length < 6) next.password = 'Use ao menos 6 caracteres';
            setErrors(next);
            if (Object.keys(next).length === 0) login(email, password);
          }}
        />
        <TouchableOpacity accessibilityRole="button" onPress={goSignup} style={{ marginTop: theme.spacing(2), alignSelf: 'center' }}>
          <Text style={{ color: theme.colors.accent }}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};