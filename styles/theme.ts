export const palette = {
  black: '#1A1A1A',
  blue: '#0066CC',
  // Revert: restore original purple accent
  purple: '#9B4DFF',
  gray800: '#222326',
  gray600: '#2E2F33',
  gray400: '#46474D',
  white: '#FFFFFF',
  danger: '#FF4D5D',
  warning: '#FFC107',
  success: '#2ECC71'
};

export const theme = {
  colors: {
    background: palette.black,
    surface: palette.gray800,
    surfaceAlt: palette.gray600,
    border: palette.gray400,
    textPrimary: palette.white,
    textSecondary: '#C9C9D1',
  accent: palette.purple,
  accentAlt: palette.blue,
  button: palette.purple,
  buttonAlt: palette.blue,
  buttonText: palette.white,
    danger: palette.danger,
  warning: palette.warning,
  orange: '#FF7A00',
    success: palette.success,
    white: palette.white
  },
  gradients: {
    // Optional: keep hero gradient dark with subtle purple tint
    hero: ['#1A1A1A', '#202028'],
    card: ['#202028', '#1A1A1F'],
    // Restore purple-to-blue accent gradient
    accent: ['#9B4DFF', '#0066CC']
  },
  spacing: (factor: number) => factor * 8,
  radius: {
    sm: 4,
    md: 8,
    lg: 16,
    pill: 999
  },
  typography: {
    fontFamily: 'System',
    fontFamilySemi: 'System',
    fontFamilyBold: 'System',
    displayFamily: 'System',
    headingFamily: 'System',
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      display: 32
    },
    lineHeight: {
      compact: 1.1,
      normal: 1.3,
      relaxed: 1.5
    }
  },
  elevation: {
    sm: 2,
    md: 6,
    lg: 12
  }
};

export type Theme = typeof theme;
