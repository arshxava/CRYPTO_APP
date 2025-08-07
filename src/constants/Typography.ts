import {Platform} from 'react-native';

export const Typography = {
  // Font families matching website
  fontFamily: {
    regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
    medium: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
    bold: Platform.OS === 'ios' ? 'System' : 'Roboto-Bold',
    light: Platform.OS === 'ios' ? 'System' : 'Roboto-Light',
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line heights
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 40,
    '4xl': 44,
    '5xl': 56,
  },
  
  // Font weights
  fontWeight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  
  // Text styles matching the website
  styles: {
    h1: {
      fontSize: 48,
      lineHeight: 56,
      fontWeight: '700' as const,
    },
    h2: {
      fontSize: 36,
      lineHeight: 44,
      fontWeight: '700' as const,
    },
    h3: {
      fontSize: 30,
      lineHeight: 40,
      fontWeight: '600' as const,
    },
    h4: {
      fontSize: 24,
      lineHeight: 36,
      fontWeight: '600' as const,
    },
    h5: {
      fontSize: 20,
      lineHeight: 32,
      fontWeight: '600' as const,
    },
    h6: {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
    },
    bodySmall: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as const,
    },
    button: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600' as const,
    },
    buttonSmall: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600' as const,
    },
  },
};