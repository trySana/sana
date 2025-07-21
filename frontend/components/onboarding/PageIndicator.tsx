import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { colors, spacing } from "../../constants/theme";

interface PageIndicatorProps {
  totalPages: number;
  currentPage: number;
  animated?: boolean;
}

export const PageIndicator: React.FC<PageIndicatorProps> = ({
  totalPages,
  currentPage,
  animated = true,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalPages }, (_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor:
                index === currentPage ? colors.primary : colors.textLight,
              width: index === currentPage ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: spacing.xs,
  },
});
