import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './styles/ThemeContext';
import { AuthProvider, useAuth } from './contexto/AuthContext';
import { WellbeingProvider } from './contexto/WellbeingContext';
import { LogProvider } from './contexto/LogContext';
import { useWellbeing } from './contexto/WellbeingContext';
import { useRecommendations } from './control/useRecommendations';
import Login from './view/Login';
import Signup from './view/Cadastro';
import Dashboard from './view/Dashboard';
import Wellbeing from './view/BemEstar';
import Logger from './view/RegistroHoras';
import Recommendations from './view/Recomendacoes';
import Profile from './view/Perfil';
import Settings from './view/Configuracao';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AppTabs() {
  const { logout, session } = useAuth();
  const { theme } = useTheme();
  const { entries } = useWellbeing();
  const { recs } = useRecommendations(session?.user.id ?? 'guest', entries);

  const makeOptions = (
    title: string,
    label: string,
    icon:
      | { type: 'feather'; name: string }
      | { type: 'mci'; name: string },
    badge?: number
  ) => ({
    title,
    tabBarLabel: label,
    tabBarIcon: ({ color, size }: { color: string; size: number }) =>
      icon.type === 'feather' ? (
        <Feather name={icon.name as any} size={size} color={color} />
      ) : (
        <MaterialCommunityIcons name={icon.name as any} size={size} color={color} />
      ),
    tabBarBadge: badge && badge > 0 ? Math.min(badge, 99) : undefined,
    tabBarBadgeStyle: { backgroundColor: theme.colors.accent },
  });

  return (
    // @ts-expect-error Temporary: react-navigation v7 + React 19 types mismatch for Navigator props
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.colors.surface },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tab.Screen name="Dashboard" options={makeOptions('Dashboard', 'Dashboard', { type: 'feather', name: 'home' })}>
        {(navProps: any) => <Dashboard onLogout={logout} {...navProps} />}
      </Tab.Screen>

      <Tab.Screen name="Bem-estar" options={makeOptions('Bem-estar', 'Bem-estar', { type: 'mci', name: 'heart-outline' })}>
        {(navProps: any) => <Wellbeing {...navProps} />}
      </Tab.Screen>

      <Tab.Screen name="Registro" options={makeOptions('Registro de Horas', 'Registro', { type: 'feather', name: 'clipboard' })}>
        {(navProps: any) => <Logger {...navProps} />}
      </Tab.Screen>

      <Tab.Screen name="Recomendações" options={makeOptions('Recomendações', 'Recs', { type: 'feather', name: 'star' }, recs.length)}>
        {(navProps: any) => <Recommendations {...navProps} />}
      </Tab.Screen>

      <Tab.Screen name="Perfil" options={makeOptions('Perfil', 'Perfil', { type: 'feather', name: 'user' })}>
        {(navProps: any) => <Profile {...navProps} />}
      </Tab.Screen>

      <Tab.Screen name="Config" options={makeOptions('Configurações', 'Config', { type: 'feather', name: 'settings' })}>
        {(navProps: any) => <Settings {...navProps} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { session } = useAuth();
  return (
    // @ts-expect-error Temporary: react-navigation v7 + React 19 types mismatch for Navigator props
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="App" component={AppTabs} />
      ) : (
        <>
          <Stack.Screen name="Login" children={({ navigation }) => (
            <Login onLogged={() => navigation.replace('App')} goSignup={() => navigation.navigate('Signup')} />
          )} />
          <Stack.Screen name="Signup" children={({ navigation }) => (
            <Signup goLogin={() => navigation.replace('Login')} />
          )} />
        </>
      )}
    </Stack.Navigator>
  );
}

function Providers() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WellbeingProvider>
          <LogProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
            <StatusBar style="light" />
          </LogProvider>
        </WellbeingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return <Providers />;
}
