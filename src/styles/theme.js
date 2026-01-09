// Paleta de cores moderna e profissional
export const COLORS = {
  // Cores principais
  primary: '#1E88E5',        // Azul vibrante
  primaryLight: '#E3F2FD',   // Azul claro
  primaryDark: '#1565C0',    // Azul escuro
  
  // Status
  success: '#43A047',        // Verde - Úmido
  successLight: '#E8F5E9',   // Verde claro
  danger: '#E53935',         // Vermelho - Seco
  dangerLight: '#FFEBEE',    // Vermelho claro
  warning: '#FB8C00',        // Laranja - Aviso
  warningLight: '#FFF3E0',   // Laranja claro
  
  // Neutras
  background: '#F5F7FA',     // Fundo cinza muito claro
  white: '#FFFFFF',
  
  // Texto
  text: '#2C3E50',           // Texto escuro
  textLight: '#7F8C8D',      // Texto médio
  textLighter: '#BDC3C7',    // Texto claro
  
  // UI
  border: '#E8EBED',
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowDark: 'rgba(0, 0, 0, 0.15)',
};

// Tamanhos e espaçamentos
export const SIZES = {
  // Espaçamento
  baseSpacing: 16,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  
  // Border Radius
  borderRadius: 16,
  borderRadiusSmall: 8,
  borderRadiusMedium: 12,
  borderRadiusLarge: 20,
  borderRadiusExtraLarge: 24,
  
  // Font sizes
  fontSize: {
    xs: 11,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 32,
  },
};

// Estilos de sombra com gradação de profundidade
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  light: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  heavy: {
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Tipografia
export const TYPOGRAPHY = {
  // Headings
  h1: {
    fontSize: SIZES.fontSize.xxxl,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: SIZES.fontSize.xxl,
    fontWeight: '700',
    lineHeight: 32,
  },
  h3: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: '600',
    lineHeight: 28,
  },
  h4: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    lineHeight: 24,
  },
  
  // Body
  body: {
    fontSize: SIZES.fontSize.md,
    fontWeight: '400',
    lineHeight: 20,
  },
  bodyBold: {
    fontSize: SIZES.fontSize.md,
    fontWeight: '600',
    lineHeight: 20,
  },
  
  // Labels
  label: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    lineHeight: 16,
  },
  caption: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: '400',
    lineHeight: 14,
  },
};

// Fontes
export const FONTS = {
  regular: 'Roboto-Regular',
  bold: 'Roboto-Bold',
};
