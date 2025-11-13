import React, { useState } from 'react';
import { TextInput, View, Text, Pressable } from 'react-native';
import { useTheme } from '../../../styles/ThemeContext';
import { Feather } from '@expo/vector-icons';

type Props = {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  secure?: boolean;
  icon?: string; // feather icon name
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
};

export default function FormField({ label, value, onChange, placeholder, secure, icon, error, autoCapitalize = 'none', keyboardType = 'default' }: Props) {
  const { theme } = useTheme();
  const [show, setShow] = useState(false);
  const isSecure = secure && !show;
  const borderColor = error ? theme.colors.danger : theme.colors.border;
  return (
    <View style={{ marginBottom: theme.spacing(1.5) }}>
      {label && <Text style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing(0.5), fontSize: theme.typography.sizes.sm }}>{label}</Text>}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.radius.md, borderWidth: 1, borderColor }}>
        {icon && (
          <Feather name={icon as any} size={18} color={theme.colors.textSecondary} style={{ marginLeft: theme.spacing(1) }} />
        )}
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry={isSecure}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          style={{ flex: 1, paddingVertical: theme.spacing(1), paddingHorizontal: theme.spacing(icon ? 1 : 1.5), color: theme.colors.textPrimary, fontFamily: theme.typography.fontFamily }}
        />
        {secure && (
          <Pressable onPress={() => setShow(s => !s)} style={{ paddingHorizontal: theme.spacing(1), paddingVertical: theme.spacing(0.5) }}>
            <Feather name={show ? 'eye-off' : 'eye'} size={18} color={theme.colors.textSecondary} />
          </Pressable>
        )}
      </View>
      {error && <Text style={{ color: theme.colors.danger, marginTop: theme.spacing(0.5), fontSize: theme.typography.sizes.xs }}>{error}</Text>}
    </View>
  );
};