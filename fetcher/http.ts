import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Função global para exibir erros personalizados (agora usando Alert do React Native)
export let showGlobalError = (msg: string) => { 
  console.log('[GLOBAL ERROR]', msg);
  Alert.alert('Erro', msg);
};
export function setGlobalErrorHandler(fn: (msg: string) => void) { showGlobalError = fn; }

export const api = axios.create({
  baseURL: 'http://192.168.0.24:8080',
  timeout: 10000,
});

// Interceptor para adicionar o token JWT no header Authorization
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    // adiciona header com cuidado na tipagem do axios
    try {
      if (token) {
        (config.headers as any)['Authorization'] = `Bearer ${token}`;
      }
      console.log('[http] Request:', config.method, config.url, { hasToken: !!token });
    } catch (e) {
      console.log('[http] Erro ao ajustar headers da requisição', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => {
    console.log('[http] Response:', res.config?.method, res.config?.url, res.status);
    return res;
  },
  (err) => {
    let customMsg = '';
    // Oracle constraint violation
    if (err?.response?.data && typeof err.response.data === 'string' && err.response.data.includes('ORA-02290')) {
      customMsg = 'Algum valor enviado está fora do permitido. Verifique os campos e tente novamente.';
    }
    // Unauthorized
    else if (err?.response?.status === 401) {
      customMsg = 'Sessão expirada ou não autenticado. Faça login novamente.';
    }
    // Forbidden
    else if (err?.response?.status === 403) {
      customMsg = 'Você não tem permissão para executar esta ação.';
    }
    // Validation error (Spring)
    else if (err?.response?.data && typeof err.response.data === 'string' && err.response.data.includes('validation')) {
      customMsg = 'Dados inválidos. Corrija os campos destacados.';
    }
    // Fallback
    else if (err?.message) {
      customMsg = 'Erro: ' + err.message;
    }
    if (customMsg) {
      showGlobalError(customMsg);
    }
    console.log('[http] Response error:', err?.config?.url, err?.response?.status, err?.message);
    return Promise.reject(err);
  }
);
