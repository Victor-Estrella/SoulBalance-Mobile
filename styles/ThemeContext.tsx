import React, { createContext, useContext, useMemo, useState } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { theme as darkTheme, Theme } from './theme';
import { useFonts as useInter, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFonts as usePoppins, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

interface ThemeContextValue {
  theme: Theme;
  scheme: ColorSchemeName;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: darkTheme, scheme: 'dark' });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sys = useColorScheme();
  const [scheme] = useState<ColorSchemeName>(sys ?? 'dark');
  const [interLoaded] = useInter({ Inter_400Regular, Inter_600SemiBold, Inter_700Bold });
  const [poppinsLoaded] = usePoppins({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });
  const themed = useMemo<Theme>(() => {
    if (interLoaded || poppinsLoaded) {
      return {
        ...darkTheme,
        typography: {
          ...darkTheme.typography,
          fontFamily: interLoaded ? 'Inter_400Regular' : darkTheme.typography.fontFamily,
          fontFamilySemi: interLoaded ? 'Inter_600SemiBold' : darkTheme.typography.fontFamilySemi,
          fontFamilyBold: interLoaded ? 'Inter_700Bold' : darkTheme.typography.fontFamilyBold,
          displayFamily: poppinsLoaded ? 'Poppins_700Bold' : (interLoaded ? 'Inter_700Bold' : darkTheme.typography.fontFamilyBold),
          headingFamily: poppinsLoaded ? 'Poppins_600SemiBold' : (interLoaded ? 'Inter_600SemiBold' : darkTheme.typography.fontFamilySemi)
        },
      };
    }
    return darkTheme;
  }, [interLoaded, poppinsLoaded]);

  const value = useMemo(() => ({ theme: themed, scheme }), [themed, scheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
