import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import Gradient from './Gradient';
import { useTheme } from '../../../styles/ThemeContext';

type Props = {
  title: string;
  subtitle?: string;
  image?: ImageSourcePropType;
  imageSize?: number;
  tintColor?: string;
};

export default function HeroCard({ title, subtitle, image, imageSize = 72, tintColor }: Props) {
  const { theme } = useTheme();
  return (
    <Gradient colors={theme.gradients.accent} style={{ padding: theme.spacing(3), borderRadius: theme.radius.lg, marginBottom: theme.spacing(2), overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, paddingRight: theme.spacing(2) }}>
            <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.lg, fontFamily: theme.typography.headingFamily }}>{title}</Text>
            {!!subtitle && <Text style={{ color: theme.colors.textSecondary, marginTop: theme.spacing(0.5), fontFamily: theme.typography.fontFamily }}>{subtitle}</Text>}
        </View>
        {image && (
          <Image
            source={image}
            style={{ width: imageSize, height: imageSize, borderRadius: 12, resizeMode: 'contain', tintColor: tintColor }}
          />
        )}
      </View>
    </Gradient>
  );
};
