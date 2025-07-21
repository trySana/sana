import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Platform } from "react-native";
import {
  colors,
  typography,
  spacing,
  dimensions,
  animations,
} from "../../constants/theme";

interface OnboardingPageProps {
  title: string;
  description: string;
  illustration: React.ReactNode;
  isActive: boolean;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  title,
  description,
  illustration,
  isActive,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (isActive) {
      // Animation d'entrée avec délai pour effet smooth
      Animated.sequence([
        Animated.delay(100), // Petit délai pour fluidité
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: animations.durations.slow,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            ...animations.spring.medium,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      // Reset instantané pour les pages inactives
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
    }
  }, [isActive]);

  return (
    <View style={styles.container}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>{illustration}</View>

      {/* Contenu textuel */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: dimensions.screenWidth,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: Platform.OS === "ios" ? dimensions.safeAreaTop : spacing.xl,
    paddingBottom: spacing.xxl,
  },
  illustrationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xxl,
    maxHeight: dimensions.screenHeight * 0.5,
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    maxWidth: dimensions.maxContentWidth,
  },
  title: {
    fontSize: typography.title1,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.lg,
    lineHeight: typography.title1 * typography.lineHeights.tight,
    letterSpacing: -0.5, // Apple letter spacing
  },
  description: {
    fontSize: typography.body,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: typography.body * typography.lineHeights.relaxed,
    maxWidth: dimensions.maxContentWidth * 0.9,
    letterSpacing: -0.24, // Apple letter spacing
  },
});
