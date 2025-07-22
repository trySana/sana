import { Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const colors = {
  // Dégradé principal selon vos maquettes (beige vers violet)
  gradientStart: "#F4EDE4", // Beige clair du haut
  gradientMiddle: "#E5D1E5", // Rose-violet intermédiaire
  gradientEnd: "#CEB1D9", // Violet du bas

  // Dégradé onboarding (bleu clair)
  onboardingStart: "#E3F2FD", // Bleu très clair
  onboardingEnd: "#BBDEFB", // Bleu clair

  // Couleurs principales selon vos maquettes
  primary: "#6892FF", // Bleu de vos maquettes
  primaryDark: "#5A7EFF", // Version plus foncée
  primaryLight: "#9BB4FF", // Version plus claire

  // Couleurs de texte selon vos maquettes
  textPrimary: "#1A1A1A", // Noir des titres
  textSecondary: "#666666", // Gris des descriptions
  textTertiary: "#999999", // Gris clair
  textLight: "#CCCCCC", // Gris très clair

  // Couleurs de background
  white: "#FFFFFF",
  cardBackground: "rgba(255, 255, 255, 0.95)", // Cards avec légère transparence

  // Couleurs système modernes
  success: "#4CAF50", // Vert moderne
  error: "#FF5252", // Rouge moderne
  warning: "#FF9800", // Orange moderne
  info: "#2196F3", // Bleu info

  // Couleurs glassmorphes modernes
  glassLight: "rgba(255, 255, 255, 0.25)", // Verre clair
  glassMedium: "rgba(255, 255, 255, 0.15)", // Verre moyen
  glassDark: "rgba(255, 255, 255, 0.1)", // Verre foncé
  glassBorder: "rgba(255, 255, 255, 0.3)", // Bordure verre

  // Couleurs d'accent modernes
  accent1: "#FFD700", // Or pour les étoiles
  accent2: "#FF6B6B", // Rouge coral
  accent3: "#4ECDC4", // Turquoise
  accent4: "#45B7D1", // Bleu ciel

  // Couleurs spéciales
  separator: "#E5E5E5", // Séparateur subtil
  shadow: "rgba(0, 0, 0, 0.1)", // Ombre douce
  shadowDark: "rgba(0, 0, 0, 0.15)", // Ombre plus prononcée

  // Couleurs des réseaux sociaux
  google: "#4285F4",
  facebook: "#1877F2",
  apple: "#000000",
};

export const typography = {
  // Tailles de police Apple (système SF)
  largeTitle: 34, // Large Title iOS
  title1: 28, // Title 1 iOS
  title2: 22, // Title 2 iOS
  title3: 20, // Title 3 iOS
  headline: 17, // Headline iOS
  body: 17, // Body iOS
  callout: 16, // Callout iOS
  subhead: 15, // Subhead iOS
  footnote: 13, // Footnote iOS
  caption1: 12, // Caption 1 iOS
  caption2: 11, // Caption 2 iOS

  // Backward compatibility
  h1: 34,
  h2: 28,
  h3: 22,
  h4: 20,

  // Poids Apple
  weights: {
    ultraLight: "100" as const,
    thin: "200" as const,
    light: "300" as const,
    regular: "400" as const,
    medium: "500" as const,
    semiBold: "600" as const,
    bold: "700" as const,
    heavy: "800" as const,
    black: "900" as const,
  },

  // Hauteurs de ligne Apple
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

export const spacing = {
  // Espacements Apple (multiples de 4 et 8)
  xs: 4, // 4pt
  sm: 8, // 8pt
  md: 16, // 16pt
  lg: 24, // 24pt
  xl: 32, // 32pt
  xxl: 48, // 48pt
  xxxl: 64, // 64pt

  // Espacements spécifiques Apple
  micro: 2,
  tiny: 6,
  base: 12,
  large: 20,
  huge: 40,
};

export const borderRadius = {
  // Rayons Apple (plus arrondis)
  xs: 4,
  sm: 8,
  md: 12, // Standard Apple
  lg: 16, // Cards Apple
  xl: 20, // Buttons Apple
  xxl: 28, // Large elements
  card: 12, // Card standard
  button: 16, // Button standard
  input: 10, // Input standard
  full: 999,
};

export const shadows = {
  // Ombres Apple (plus subtiles)
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },

  // Nouvelles ombres glassmorphes modernes
  glass: {
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  glassHeavy: {
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 16,
  },
  floating: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const dimensions = {
  screenWidth,
  screenHeight,
  // Dimensions Apple
  buttonHeight: 50, // Hauteur bouton Apple
  inputHeight: 44, // Hauteur input Apple
  headerHeight: 44, // Navigation bar Apple
  tabBarHeight: 83, // Tab bar Apple (49 + safe area)

  // Mobile specific dimensions
  maxContentWidth: Math.min(screenWidth * 0.9, 400),
  safeAreaTop: 44, // iPhone notch
  safeAreaBottom: 34, // iPhone home indicator

  // Dimensions d'éléments Apple
  minTouchTarget: 44, // Taille minimale touch Apple
  iconSize: 24, // Taille icône standard
  avatarSize: 40, // Taille avatar standard
};

// Animations Apple avec courbes et durées
export const animations = {
  // Durées Apple (en ms)
  durations: {
    fast: 200, // Interactions rapides
    normal: 300, // Transitions standard
    slow: 500, // Transitions complexes
    spring: 600, // Animations spring
  },

  // Courbes d'animation Apple
  curves: {
    // Courbes iOS natives
    easeInOut: [0.25, 0.1, 0.25, 1] as const,
    easeOut: [0, 0, 0.58, 1] as const,
    easeIn: [0.42, 0, 1, 1] as const,

    // Courbes Apple spécifiques
    spring: [0.68, -0.55, 0.265, 1.55] as const,
    bounce: [0.175, 0.885, 0.32, 1.275] as const,
    smooth: [0.25, 0.46, 0.45, 0.94] as const,
  },

  // Configurations spring Apple
  spring: {
    gentle: { tension: 120, friction: 14 },
    medium: { tension: 170, friction: 26 },
    firm: { tension: 250, friction: 30 },
    bouncy: { tension: 180, friction: 12 },
  },

  // Échelles d'animation
  scales: {
    tap: 0.96, // Effet de tap Apple
    press: 0.94, // Effet de press Apple
    pop: 1.05, // Effet d'apparition
  },
};
