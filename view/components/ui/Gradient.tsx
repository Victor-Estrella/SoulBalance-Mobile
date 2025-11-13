import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../../styles/ThemeContext';

let LinearGradientImpl: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LinearGradientImpl = require('expo-linear-gradient').LinearGradient;
} catch (e) {
  LinearGradientImpl = null;
}

type Props = {
  colors?: string[];
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
};

export const Gradient: React.FC<Props> = ({ colors, style, children }) => {
  const { theme } = useTheme();
  const c = colors ?? theme.gradients.hero;
  if (LinearGradientImpl) {
    return <LinearGradientImpl colors={c} style={style as any}>{children}</LinearGradientImpl>;
  }
  return <View style={[{ backgroundColor: c[0] }, style]}>{children}</View>;
};

export default Gradient;
