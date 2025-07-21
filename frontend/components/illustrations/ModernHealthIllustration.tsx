import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Path, Rect, G, Ellipse } from "react-native-svg";

interface ModernHealthIllustrationProps {
  size?: number;
}

export const ModernHealthIllustration: React.FC<
  ModernHealthIllustrationProps
> = ({ size = 280 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 280 280">
        {/* Background elements */}
        <Ellipse cx="70" cy="80" rx="30" ry="20" fill="#FFE0B2" opacity="0.6" />
        <Ellipse
          cx="210"
          cy="90"
          rx="25"
          ry="15"
          fill="#E1F5FE"
          opacity="0.7"
        />
        <Circle cx="40" cy="180" r="15" fill="#F3E5F5" opacity="0.5" />
        <Circle cx="230" cy="200" r="20" fill="#E8F5E8" opacity="0.6" />

        {/* Main person - standing confidently */}
        {/* Head */}
        <Circle cx="140" cy="85" r="25" fill="#FFAB91" />

        {/* Hair */}
        <Path
          d="M 115 70 Q 140 50 165 70 Q 160 85 140 85 Q 120 85 115 70"
          fill="#5D4037"
        />

        {/* Body - orange shirt */}
        <Rect x="115" y="110" width="50" height="60" rx="25" fill="#FF8A65" />

        {/* Arms */}
        <Ellipse cx="95" cy="130" rx="12" ry="25" fill="#FFAB91" />
        <Ellipse cx="185" cy="130" rx="12" ry="25" fill="#FFAB91" />

        {/* Pants - black */}
        <Rect x="120" y="170" width="40" height="50" rx="20" fill="#424242" />

        {/* Legs */}
        <Ellipse cx="130" cy="240" rx="8" ry="20" fill="#FFAB91" />
        <Ellipse cx="150" cy="240" rx="8" ry="20" fill="#FFAB91" />

        {/* Shoes */}
        <Ellipse cx="130" cy="265" rx="12" ry="8" fill="#2196F3" />
        <Ellipse cx="150" cy="265" rx="12" ry="8" fill="#2196F3" />

        {/* Phone in hand */}
        <Rect x="175" y="125" width="18" height="30" rx="4" fill="#333333" />
        <Rect x="177" y="127" width="14" height="26" rx="2" fill="#4CAF50" />

        {/* Health cross on phone */}
        <Path
          d="M 181 135 L 181 145 M 176 140 L 186 140"
          stroke="white"
          strokeWidth="1.5"
        />

        {/* Medical chart/interface floating */}
        <G transform="translate(50, 150)">
          <Rect
            x="0"
            y="0"
            width="60"
            height="40"
            rx="8"
            fill="white"
            opacity="0.9"
          />
          <Path
            d="M 10 15 L 20 15 M 15 10 L 15 20"
            stroke="#FF5722"
            strokeWidth="2"
          />
          <Path
            d="M 30 10 L 50 10 M 30 20 L 45 20"
            stroke="#E0E0E0"
            strokeWidth="2"
          />
          <Path d="M 30 30 L 40 30" stroke="#E0E0E0" strokeWidth="2" />
        </G>

        {/* Health icons floating around */}
        {/* Heart */}
        <G transform="translate(200, 160)">
          <Path
            d="M 15 10 C 15 5 20 0 25 5 C 30 0 35 5 35 10 C 35 20 25 30 25 30 C 25 30 15 20 15 10 Z"
            fill="#E91E63"
          />
        </G>

        {/* Stethoscope icon */}
        <G transform="translate(30, 120)">
          <Circle cx="15" cy="25" r="8" fill="#2196F3" opacity="0.8" />
          <Path
            d="M 15 17 Q 15 10 20 10 Q 25 10 25 15"
            stroke="#2196F3"
            strokeWidth="3"
            fill="none"
          />
          <Path
            d="M 20 10 Q 15 5 10 10 Q 5 10 5 15"
            stroke="#2196F3"
            strokeWidth="3"
            fill="none"
          />
        </G>

        {/* Pills/medicine */}
        <G transform="translate(220, 120)">
          <Ellipse cx="10" cy="10" rx="8" ry="5" fill="#FF9800" />
          <Ellipse cx="10" cy="10" rx="4" ry="5" fill="#FFC107" />
        </G>

        {/* Temperature/thermometer */}
        <G transform="translate(60, 100)">
          <Rect x="8" y="0" width="4" height="20" rx="2" fill="#F44336" />
          <Circle cx="10" cy="25" r="6" fill="#F44336" />
          <Path d="M 10 5 L 10 20" stroke="white" strokeWidth="1" />
        </G>

        {/* Activity/pulse line */}
        <Path
          d="M 80 220 L 90 220 L 95 210 L 100 230 L 105 220 L 120 220 L 125 210 L 130 220 L 200 220"
          stroke="#4CAF50"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />

        {/* Plus signs scattered */}
        <Path
          d="M 50 50 L 55 50 M 52.5 47.5 L 52.5 52.5"
          stroke="#FF5722"
          strokeWidth="2"
        />
        <Path
          d="M 200 50 L 205 50 M 202.5 47.5 L 202.5 52.5"
          stroke="#2196F3"
          strokeWidth="2"
        />
        <Path
          d="M 250 180 L 255 180 M 252.5 177.5 L 252.5 182.5"
          stroke="#4CAF50"
          strokeWidth="2"
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
