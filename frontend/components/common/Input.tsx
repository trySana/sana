import React, { useState, useRef } from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
  TextStyle,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  typography,
  dimensions,
  borderRadius,
  spacing,
  shadows,
} from "../../constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  variant?: "default" | "filled";
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  rightIcon,
  leftIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  variant = "default",
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (textInputProps.onFocus) {
      textInputProps.onFocus(e);
    }
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (textInputProps.onBlur) {
      textInputProps.onBlur(e);
    }
  };

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      height: dimensions.inputHeight,
      borderRadius: borderRadius.input,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
    };

    switch (variant) {
      case "filled":
        return {
          ...baseStyle,
          backgroundColor: colors.cardBackground,
          borderWidth: 0,
          ...shadows.xs,
        };
      case "default":
      default:
        return {
          ...baseStyle,
          backgroundColor: colors.white,
          borderWidth: 0.5,
          borderColor: colors.separator,
          ...shadows.xs,
        };
    }
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Text
          style={{
            fontSize: typography.footnote,
            fontWeight: typography.weights.medium,
            color: colors.textSecondary,
            marginBottom: spacing.sm,
          }}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          getContainerStyle(),
          {
            borderColor: error
              ? colors.error
              : isFocused
                ? colors.primary
                : colors.separator,
            borderWidth: isFocused ? 1.5 : 0.5,
            ...(isFocused && shadows.sm),
          },
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={isFocused ? colors.primary : colors.textLight}
            style={{ marginRight: spacing.sm }}
          />
        )}

        <TextInput
          {...textInputProps}
          style={[
            {
              flex: 1,
              fontSize: typography.body,
              fontWeight: typography.weights.regular,
              color: colors.textPrimary,
              paddingVertical: 0, // Remove default padding
            },
            inputStyle,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.textLight}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={{ marginLeft: spacing.sm }}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={isFocused ? colors.primary : colors.textLight}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={{ marginTop: spacing.xs }}>
          <Text
            style={{
              fontSize: typography.caption1,
              color: colors.error,
              fontWeight: typography.weights.medium,
            }}
          >
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};
