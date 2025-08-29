import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from "../../constants/theme";

interface ValidatedInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  validationMessage?: string;
  isValid?: boolean;
  showValidation?: boolean;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  validationMessage,
  isValid,
  showValidation = false,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    props.onFocus?.(undefined as any);
  };

  const handleBlur = () => {
    setIsFocused(false);
    props.onBlur?.(undefined as any);
  };

  const getBorderColor = () => {
    if (error) return colors.error;
    if (showValidation && isValid === false) return colors.error;
    if (showValidation && isValid === true) return colors.success;
    if (isFocused) return colors.primary;
    return colors.separator;
  };

  const getIconColor = () => {
    if (error) return colors.error;
    if (showValidation && isValid === false) return colors.error;
    if (showValidation && isValid === true) return colors.success;
    return colors.textSecondary;
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          { borderColor: getBorderColor() },
          style,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={20}
            color={getIconColor()}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[styles.input, leftIcon && styles.inputWithLeftIcon]}
          placeholderTextColor={colors.textSecondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {rightIcon && (
          <Ionicons
            name={rightIcon as any}
            size={20}
            color={getIconColor()}
            style={styles.rightIcon}
            onPress={onRightIconPress}
          />
        )}
      </View>

      {/* Error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Validation message */}
      {showValidation && validationMessage && (
        <Text
          style={[
            styles.validationText,
            { color: isValid ? colors.success : colors.error },
          ]}
        >
          {validationMessage}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.footnote,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  inputWithLeftIcon: {
    marginLeft: spacing.sm,
  },
  leftIcon: {
    marginRight: spacing.xs,
  },
  rightIcon: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  errorText: {
    fontSize: typography.caption1,
    color: colors.error,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  validationText: {
    fontSize: typography.caption1,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
