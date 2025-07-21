import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Platform,
} from "react-native";
import { GradientBackground } from "../components/common";
import { SanaLogo } from "../components/icons/SanaLogo";
import {
  colors,
  typography,
  spacing,
  dimensions,
  animations,
} from "../constants/theme";

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onAnimationComplete,
}) => {
  // Valeurs d'animation avec Animated API natif
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(30)).current;

  // Fonction de callback pour la fin d'animation
  const handleAnimationComplete = () => {
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  // Démarrer les animations en séquence
  useEffect(() => {
    // Animation du logo avec effet de rebond Apple
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        ...animations.spring.bouncy,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: animations.durations.spring,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation du titre avec délai et courbe Apple
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: animations.durations.slow,
          useNativeDriver: true,
        }),
        Animated.spring(titleTranslateY, {
          toValue: 0,
          ...animations.spring.medium,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    // Animation du sous-titre avec délai et courbe Apple
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: animations.durations.slow,
          useNativeDriver: true,
        }),
        Animated.spring(subtitleTranslateY, {
          toValue: 0,
          ...animations.spring.medium,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Animation terminée avec timing Apple
        setTimeout(() => {
          handleAnimationComplete();
        }, 800);
      });
    }, 500);
  }, []);

  return (
    <GradientBackground variant="main" style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={Platform.OS === "android"}
        hidden={Platform.OS === "ios"}
      />

      <View style={styles.content}>
        {/* Logo Sana animé */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <SanaLogo size={160} />
        </Animated.View>

        {/* Titre "Sana" */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            },
          ]}
        >
          <Text style={styles.title}>Sana</Text>
        </Animated.View>

        {/* Sous-titre */}
        <Animated.View
          style={[
            styles.subtitleContainer,
            {
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleTranslateY }],
            },
          ]}
        >
          <Text style={styles.subtitle}>Intelligent Health Assistant</Text>
        </Animated.View>
      </View>

      {/* Indicateur mobile (barre noire en bas) */}
      {Platform.OS === "ios" && <View style={styles.homeIndicator} />}
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: Platform.OS === "ios" ? dimensions.safeAreaTop : 0,
    paddingBottom:
      Platform.OS === "ios" ? dimensions.safeAreaBottom + 20 : spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    marginBottom: spacing.lg,
    alignItems: "center",
  },
  title: {
    fontSize: Math.min(
      typography.largeTitle + 8,
      dimensions.screenWidth * 0.12,
    ), // Responsive
    fontWeight: typography.weights.light,
    color: colors.primary,
    textAlign: "center",
    letterSpacing: -0.8, // Apple letter spacing
  },
  subtitleContainer: {
    marginTop: spacing.sm,
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  subtitle: {
    fontSize: typography.callout,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    textAlign: "center",
    opacity: 0.9,
    letterSpacing: -0.24, // Apple letter spacing
    maxWidth: dimensions.maxContentWidth,
  },
  homeIndicator: {
    position: "absolute",
    bottom: 8,
    left: "50%",
    marginLeft: -67, // Moitié de la largeur (134/2)
    width: 134,
    height: 5,
    backgroundColor: "#000000",
    borderRadius: 2.5,
  },
});
