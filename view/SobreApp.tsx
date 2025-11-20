import React from 'react';
import { Text, ScrollView } from 'react-native';
import { useTheme } from '../styles/ThemeContext';
import Constants from 'expo-constants';
import { sobreAppStyles } from '../styles/theme';

export default function SobreApp() {
    const { theme } = useTheme();
    const commitHash =
        Constants.expoConfig?.extra?.gitCommit ||
        process.env.EXPO_PUBLIC_GIT_COMMIT ||
        'Não encontrado';
    const version = Constants.expoConfig?.version || '1.0.0';
    const styles = sobreAppStyles(theme);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Sobre o App</Text>
            <Text style={styles.label}>Nome do App:</Text>
            <Text style={styles.value}>Global Solution - Bem-Estar</Text>
            <Text style={styles.label}>Versão:</Text>
            <Text style={styles.value}>{version}</Text>
            <Text style={styles.label}>Hash do Commit:</Text>
            <Text style={styles.value}>{commitHash}</Text>
        </ScrollView>
    );
}