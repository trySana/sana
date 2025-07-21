import React, { useRef, useEffect } from "react";
import { Animated, ViewStyle } from "react-native";
import { animations } from "../../constants/theme";

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  translateY?: number;
  style?: ViewStyle;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  delay = 0,
  duration = animations.durations.normal,
  translateY = 20,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(translateY)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.spring(translateAnim, {
          toValue: 0,
          ...animations.spring.medium,
          useNativeDriver: true,
        }),
      ]).start();
    };

    if (delay > 0) {
      const timer = setTimeout(startAnimation, delay);
      return () => clearTimeout(timer);
    } else {
      startAnimation();
    }
  }, [fadeAnim, translateAnim, delay, duration]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateAnim }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};
