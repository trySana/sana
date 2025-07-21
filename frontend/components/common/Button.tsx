import React, { useRef } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
} from "react-native";
import {
  colors,
  typography,
  dimensions,
  borderRadius,
  shadows,
  animations,
} from "../../constants/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: animations.scales.tap,
        ...animations.spring.firm,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.9,
        duration: animations.durations.fast,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        ...animations.spring.medium,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: animations.durations.fast,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getButtonStyle = (): ViewStyle => {
    const height =
      size === "small" ? 36 : size === "large" ? 56 : dimensions.buttonHeight;

    const baseStyle: ViewStyle = {
      height,
      borderRadius: borderRadius.button,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: size === "small" ? 16 : 20,
      minWidth: dimensions.minTouchTarget,
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.textTertiary : colors.primary,
          ...(!disabled && shadows.sm),
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: colors.cardBackground,
          borderWidth: 0.5,
          borderColor: colors.separator,
          ...shadows.xs,
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: disabled ? colors.textTertiary : colors.primary,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: size === "small" ? typography.footnote : typography.callout,
      fontWeight: typography.weights.semiBold,
      letterSpacing: -0.24, // Apple letter spacing
      textAlign: "center",
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          color: colors.white,
          fontWeight: typography.weights.semiBold,
        };
      case "secondary":
        return {
          ...baseStyle,
          color: colors.textPrimary,
          fontWeight: typography.weights.medium,
        };
      case "outline":
        return {
          ...baseStyle,
          color: disabled ? colors.textTertiary : colors.primary,
          fontWeight: typography.weights.medium,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <Animated.View
      style={[
        getButtonStyle(),
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      <TouchableOpacity
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === "primary" ? colors.white : colors.primary}
            size="small"
          />
        ) : (
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};
