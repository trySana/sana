import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../constants/theme";

const { height: screenHeight } = Dimensions.get("window");

interface BottomSheetProps {
  children?: React.ReactNode;
  title?: string;
  isVisible?: boolean;
  onClose?: () => void;
  snapPoints?: number[];
  initialSnapIndex?: number;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  title = "Plus d'infos",
  isVisible = true,
  onClose,
  snapPoints = [0.15, 0.5, 0.85], // Pourcentages de la hauteur d'écran
  initialSnapIndex = 0,
}) => {
  const translateY = useRef(
    new Animated.Value(screenHeight * (1 - snapPoints[initialSnapIndex])),
  ).current;
  const currentSnapIndex = useRef(initialSnapIndex);
  const currentPosition = useRef(
    screenHeight * (1 - snapPoints[initialSnapIndex]),
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        (translateY as any).setOffset(currentPosition.current);
        translateY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        (translateY as any).flattenOffset();

        const newPosition = currentPosition.current + gestureState.dy;
        const velocity = gestureState.vy;

        // Déterminer vers quel snap point aller
        let targetSnapIndex = currentSnapIndex.current;

        if (Math.abs(velocity) > 0.5) {
          // Mouvement rapide
          targetSnapIndex =
            velocity > 0
              ? Math.max(0, currentSnapIndex.current - 1)
              : Math.min(snapPoints.length - 1, currentSnapIndex.current + 1);
        } else {
          // Mouvement lent, aller au snap point le plus proche
          const distances = snapPoints.map((snap, index) => ({
            index,
            distance: Math.abs(newPosition - screenHeight * (1 - snap)),
          }));

          const closest = distances.reduce((prev, curr) =>
            prev.distance < curr.distance ? prev : curr,
          );

          targetSnapIndex = closest.index;
        }

        snapTo(targetSnapIndex);
      },
    }),
  ).current;

  const snapTo = (index: number) => {
    const targetY = screenHeight * (1 - snapPoints[index]);
    currentSnapIndex.current = index;
    currentPosition.current = targetY;

    Animated.spring(translateY, {
      toValue: targetY,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  useEffect(() => {
    if (isVisible) {
      snapTo(initialSnapIndex);
    } else {
      snapTo(0);
    }
  }, [isVisible]);

  const handleClose = () => {
    snapTo(0);
    if (onClose) {
      setTimeout(() => onClose(), 300);
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {/* Handle bar */}
      <View style={styles.handle} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight,
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    ...shadows.xl,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.separator,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  title: {
    fontSize: typography.headline,
    fontWeight: typography.weights.semiBold,
    color: colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.cardBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
});
