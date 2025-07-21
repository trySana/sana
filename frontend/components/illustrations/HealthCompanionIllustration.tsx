import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Path, Rect, G, Ellipse } from "react-native-svg";
import { colors } from "../../constants/theme";

interface HealthCompanionIllustrationProps {
  size?: number;
}

export const HealthCompanionIllustration: React.FC<
  HealthCompanionIllustrationProps
> = ({ size = 280 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 280 280">
        {/* Background soft circle */}
        <Circle cx="140" cy="140" r="125" fill="#E8F5E8" opacity="0.3" />

        {/* Person silhouette */}
        <Circle cx="140" cy="90" r="30" fill={colors.primary} />

        {/* Body */}
        <Ellipse cx="140" cy="155" rx="35" ry="45" fill={colors.primary} />

        {/* Health shield/protection */}
        <Path
          d="M 140 50 Q 120 60 120 85 Q 120 110 140 120 Q 160 110 160 85 Q 160 60 140 50 Z"
          fill="#4CAF50"
          opacity="0.8"
        />

        {/* Cross on shield */}
        <Path
          d="M 140 65 L 140 95 M 125 80 L 155 80"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Heart monitor line */}
        <Path
          d="M 80 200 L 95 200 L 105 185 L 115 215 L 125 200 L 140 200 L 150 185 L 160 200 L 175 200 L 185 185 L 195 200 L 200 200"
          stroke="#FF6B6B"
          strokeWidth="3"
          fill="none"
        />

        {/* Health metrics bubbles */}
        <G>
          {/* Heart rate bubble */}
          <Circle cx="70" cy="120" r="20" fill="white" opacity="0.9" />
          <Path
            d="M 65 120 C 65 115 70 110 75 115 C 80 110 85 115 85 120 C 85 130 75 140 75 140 C 75 140 65 130 65 120 Z"
            fill="#FF6B6B"
          />
          <Path
            d="M 60 130 L 65 125 L 70 135 L 75 115 L 80 130 L 90 130"
            stroke="#FF6B6B"
            strokeWidth="1.5"
            fill="none"
          />
        </G>

        <G>
          {/* Temperature bubble */}
          <Circle cx="210" cy="120" r="20" fill="white" opacity="0.9" />
          <Rect x="207" y="105" width="6" height="20" rx="3" fill="#FF9800" />
          <Circle cx="210" cy="130" r="6" fill="#FF9800" />
          <Path d="M 210 110 L 210 125" stroke="white" strokeWidth="1" />
        </G>

        <G>
          {/* Steps/activity bubble */}
          <Circle cx="80" cy="180" r="18" fill="white" opacity="0.9" />
          <Path
            d="M 75 175 L 80 170 L 85 175 L 85 185 L 75 185 Z"
            fill="#2196F3"
          />
          <Path
            d="M 77 188 L 82 188"
            stroke="#2196F3"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </G>

        <G>
          {/* Sleep bubble */}
          <Circle cx="200" cy="180" r="18" fill="white" opacity="0.9" />
          <Path
            d="M 195 175 Q 200 170 205 175 Q 200 180 205 185 Q 200 190 195 185 Q 200 180 195 175"
            fill="#9C27B0"
            opacity="0.7"
          />
          <Circle cx="198" cy="177" r="1" fill="white" />
          <Circle cx="202" cy="183" r="1.5" fill="white" />
        </G>

        {/* Connection lines */}
        <G
          stroke={colors.primary}
          strokeWidth="1.5"
          opacity="0.4"
          strokeDasharray="3,3"
        >
          <Path d="M 90 120 L 110 140" />
          <Path d="M 190 120 L 170 140" />
          <Path d="M 95 175 L 115 160" />
          <Path d="M 185 175 L 165 160" />
        </G>

        {/* Notification/care indicators */}
        <Circle cx="50" cy="80" r="6" fill="#4CAF50" />
        <Path
          d="M 47 80 L 49 82 L 53 78"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />

        <Circle cx="230" cy="80" r="6" fill="#FF6B6B" />
        <Path
          d="M 230 77 L 230 83 M 227 80 L 233 80"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Care/support hands */}
        <Path
          d="M 30 140 Q 35 135 40 140 Q 35 145 30 140"
          fill={colors.primary}
          opacity="0.6"
        />

        <Path
          d="M 250 140 Q 245 135 240 140 Q 245 145 250 140"
          fill={colors.primary}
          opacity="0.6"
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
