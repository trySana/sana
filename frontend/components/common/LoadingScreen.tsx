import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { GradientBackground } from "./GradientBackground";
import { colors, typography, spacing } from "../../constants/theme";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Chargement...",
}) => {
  return (
    <GradientBackground variant="main" style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: spacing.lg,
  },
  message: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
