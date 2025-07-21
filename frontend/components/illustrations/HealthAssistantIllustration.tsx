import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { colors } from "../../constants/theme";

interface HealthAssistantIllustrationProps {
  size?: number;
}

export const HealthAssistantIllustration: React.FC<
  HealthAssistantIllustrationProps
> = ({ size = 280 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 280 280">
        {/* Background circle */}
        <Circle cx="140" cy="140" r="120" fill="#E8F4FF" opacity="0.3" />

        {/* Person silhouette */}
        <Circle cx="140" cy="100" r="25" fill={colors.primary} />

        {/* Body */}
        <Rect
          x="115"
          y="125"
          width="50"
          height="80"
          rx="25"
          fill={colors.primary}
        />

        {/* Phone in hand */}
        <Rect x="170" y="140" width="25" height="40" rx="5" fill="#4CAF50" />

        {/* Health cross on phone */}
        <Path
          d="M 180 155 L 180 165 M 175 160 L 185 160"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Stethoscope */}
        <Path
          d="M 120 135 Q 110 135 105 145 Q 105 155 115 160"
          stroke={colors.primary}
          strokeWidth="3"
          fill="none"
        />

        <Circle cx="115" cy="160" r="5" fill={colors.primary} />

        {/* Medical icons floating around */}
        <Circle cx="80" cy="80" r="15" fill="#FF6B6B" opacity="0.7" />

        <Path
          d="M 75 80 L 85 80 M 80 75 L 80 85"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Heart icon */}
        <Path
          d="M 200 70 C 200 65 205 60 210 65 C 215 60 220 65 220 70 C 220 80 210 90 210 90 C 210 90 200 80 200 70 Z"
          fill="#FF6B6B"
          opacity="0.7"
        />

        {/* Brain icon */}
        <Circle cx="90" cy="200" r="12" fill="#9C27B0" opacity="0.7" />

        <Path
          d="M 85 195 Q 90 190 95 195 Q 90 200 95 205 Q 90 210 85 205"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
