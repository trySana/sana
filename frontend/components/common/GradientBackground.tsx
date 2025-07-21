import React from "react";
import { View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, dimensions } from "../../constants/theme";

interface BackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "main" | "onboarding" | "solid";
  colors?: readonly [string, string, ...string[]];
}

export const GradientBackground: React.FC<BackgroundProps> = ({
  children,
  style,
  variant = "main",
  colors: customColors,
}) => {
  // Fond solide blanc
  if (variant === "solid") {
    return (
      <View
        style={[
          {
            flex: 1,
            backgroundColor: colors.white,
            width: dimensions.screenWidth,
            height: dimensions.screenHeight,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  // Choix du dégradé selon la variante
  let gradientColors: readonly [string, string, ...string[]];

  if (variant === "onboarding") {
    // Dégradé bleu pour onboarding
    gradientColors =
      customColors || ([colors.onboardingStart, colors.onboardingEnd] as const);
  } else {
    // Dégradé principal beige→violet
    gradientColors =
      customColors ||
      ([
        colors.gradientStart,
        colors.gradientMiddle,
        colors.gradientEnd,
      ] as const);
  }

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[
        {
          flex: 1,
          width: dimensions.screenWidth,
          height: dimensions.screenHeight,
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
};
