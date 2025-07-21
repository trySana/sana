import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Path, Rect, G } from "react-native-svg";
import { colors } from "../../constants/theme";

interface AIAnalysisIllustrationProps {
  size?: number;
}

export const AIAnalysisIllustration: React.FC<AIAnalysisIllustrationProps> = ({
  size = 280,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 280 280">
        {/* Background gradient circle */}
        <Circle cx="140" cy="140" r="130" fill="#F0F8FF" opacity="0.4" />

        {/* Central brain/AI core */}
        <Circle cx="140" cy="140" r="40" fill={colors.primary} opacity="0.9" />

        {/* Brain pattern inside */}
        <Path
          d="M 120 130 Q 140 120 160 130 Q 140 140 160 150 Q 140 160 120 150 Q 140 140 120 130"
          stroke="white"
          strokeWidth="2"
          fill="none"
          opacity="0.8"
        />

        {/* Neural network connections */}
        <G stroke={colors.primary} strokeWidth="2" opacity="0.6">
          <Path d="M 140 100 L 140 70" />
          <Path d="M 140 180 L 140 210" />
          <Path d="M 100 140 L 70 140" />
          <Path d="M 180 140 L 210 140" />
          <Path d="M 115 115 L 90 90" />
          <Path d="M 165 165 L 190 190" />
          <Path d="M 165 115 L 190 90" />
          <Path d="M 115 165 L 90 190" />
        </G>

        {/* Data nodes around the brain */}
        <Circle cx="140" cy="70" r="8" fill="#4CAF50" />
        <Circle cx="140" cy="210" r="8" fill="#FF6B6B" />
        <Circle cx="70" cy="140" r="8" fill="#FF9800" />
        <Circle cx="210" cy="140" r="8" fill="#9C27B0" />
        <Circle cx="90" cy="90" r="6" fill="#2196F3" />
        <Circle cx="190" cy="190" r="6" fill="#E91E63" />
        <Circle cx="190" cy="90" r="6" fill="#00BCD4" />
        <Circle cx="90" cy="190" r="6" fill="#8BC34A" />

        {/* Symptom icons */}
        {/* Temperature/fever */}
        <G transform="translate(120, 50)">
          <Rect x="-2" y="0" width="4" height="15" fill="white" />
          <Circle cx="0" cy="18" r="4" fill="white" />
        </G>

        {/* Heart rate */}
        <G transform="translate(50, 120)">
          <Path
            d="M 0 0 L 5 -8 L 10 8 L 15 -12 L 20 0"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        </G>

        {/* Pain indicator */}
        <G transform="translate(230, 120)">
          <Path d="M 0 -5 L 5 5 L -5 5 Z" fill="white" />
          <Path d="M 0 8 L 0 15" stroke="white" strokeWidth="2" />
        </G>

        {/* Analysis results */}
        <G transform="translate(120, 230)">
          <Rect
            x="-15"
            y="-8"
            width="30"
            height="16"
            rx="8"
            fill="white"
            opacity="0.9"
          />
          <Path
            d="M -8 0 L -3 3 L 8 -8"
            stroke={colors.primary}
            strokeWidth="2"
            fill="none"
          />
        </G>

        {/* Floating data particles */}
        <Circle cx="60" cy="60" r="2" fill={colors.primary} opacity="0.5" />
        <Circle cx="220" cy="60" r="2" fill={colors.primary} opacity="0.5" />
        <Circle cx="60" cy="220" r="2" fill={colors.primary} opacity="0.5" />
        <Circle cx="220" cy="220" r="2" fill={colors.primary} opacity="0.5" />
        <Circle cx="40" cy="180" r="1.5" fill="#4CAF50" opacity="0.6" />
        <Circle cx="240" cy="100" r="1.5" fill="#FF6B6B" opacity="0.6" />
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
