import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const Layout = {
  window: {
    width,
    height,
  },
  
  // Spacing values matching website
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  
  // Border radius values
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },
  
  // Container sizes
  container: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  
  // Header heights
  header: {
    height: 60,
    heightLarge: 80,
  },
  
  // Tab bar height
  tabBar: {
    height: 60,
  },
  
  // Card dimensions
  card: {
    minHeight: 200,
    borderRadius: 8,
  },
  
  // Button dimensions
  button: {
    height: 48,
    heightSmall: 36,
    heightLarge: 56,
  },
  
  // Input dimensions
  input: {
    height: 48,
    borderRadius: 8,
  },
  
  // Product card dimensions
  productCard: {
    width: (width - 48) / 2, // 2 columns with margin
    aspectRatio: 0.75,
  },
  
  // Breakpoints for responsive design
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  
  // Z-index values
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};