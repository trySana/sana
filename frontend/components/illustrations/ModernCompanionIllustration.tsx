import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Path, Rect, G, Ellipse } from "react-native-svg";

interface ModernCompanionIllustrationProps {
  size?: number;
}

export const ModernCompanionIllustration: React.FC<
  ModernCompanionIllustrationProps
> = ({ size = 280 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 280 280">
        {/* Background elements */}
        <Circle cx="70" cy="60" r="25" fill="#E1F5FE" opacity="0.5" />
        <Ellipse
          cx="210"
          cy="70"
          rx="20"
          ry="30"
          fill="#F3E5F5"
          opacity="0.6"
        />
        <Circle cx="40" cy="200" r="18" fill="#E8F5E8" opacity="0.5" />
        <Circle cx="230" cy="210" r="22" fill="#FFF3E0" opacity="0.6" />

        {/* Main person - with phone and health monitoring */}
        {/* Head */}
        <Circle cx="140" cy="85" r="24" fill="#FFAB91" />

        {/* Hair */}
        <Path
          d="M 118 68 Q 140 48 162 68 Q 158 85 140 85 Q 122 85 118 68"
          fill="#3E2723"
        />

        {/* Body - black/dark top */}
        <Rect x="115" y="109" width="50" height="58" rx="25" fill="#212121" />

        {/* Arms */}
        <Ellipse cx="95" cy="130" rx="11" ry="24" fill="#FFAB91" />
        <Ellipse cx="185" cy="130" rx="11" ry="24" fill="#FFAB91" />

        {/* Pants/Shorts - blue */}
        <Rect x="120" y="167" width="40" height="40" rx="20" fill="#2196F3" />

        {/* Legs */}
        <Ellipse cx="130" cy="230" rx="8" ry="20" fill="#FFAB91" />
        <Ellipse cx="150" cy="230" rx="8" ry="20" fill="#FFAB91" />

        {/* Shoes - colorful sneakers */}
        <Ellipse cx="130" cy="255" rx="12" ry="8" fill="#4CAF50" />
        <Ellipse cx="150" cy="255" rx="12" ry="8" fill="#4CAF50" />
        <Ellipse cx="130" cy="255" rx="6" ry="4" fill="white" />
        <Ellipse cx="150" cy="255" rx="6" ry="4" fill="white" />

        {/* Phone in hand */}
        <Rect x="175" y="120" width="20" height="32" rx="5" fill="#263238" />
        <Rect x="177" y="122" width="16" height="28" rx="3" fill="#E1F5FE" />

        {/* Health app interface */}
        <Circle cx="185" cy="130" r="2" fill="#4CAF50" />
        <Path
          d="M 180 138 L 190 138 M 179 143 L 191 143"
          stroke="#2196F3"
          strokeWidth="1"
        />

        {/* Heart with pulse */}
        <G transform="translate(90, 50)">
          <Path
            d="M 15 10 C 15 5 20 0 25 5 C 30 0 35 5 35 10 C 35 20 25 30 25 30 C 25 30 15 20 15 10 Z"
            fill="#E91E63"
          />
          {/* Pulse line */}
          <Path
            d="M 5 15 L 10 15 L 12 10 L 15 20 L 18 5 L 20 15 L 45 15"
            stroke="#E91E63"
            strokeWidth="2"
            fill="none"
          />
        </G>

        {/* Health metrics floating around */}

        {/* Steps counter */}
        <G transform="translate(200, 110)">
          <Circle cx="20" cy="20" r="18" fill="white" opacity="0.95" />
          <Path d="M 15 15 L 20 10 L 25 15 L 25 25 L 15 25 Z" fill="#FF9800" />
          <Path d="M 12 30 L 28 30" stroke="#FF9800" strokeWidth="2" />
          <Path d="M 10 8 L 15 8" stroke="#666666" strokeWidth="1" />
          <Path d="M 25 8 L 30 8" stroke="#666666" strokeWidth="1" />
        </G>

        {/* Sleep tracking */}
        <G transform="translate(50, 120)">
          <Circle cx="20" cy="20" r="18" fill="white" opacity="0.95" />
          <Path
            d="M 15 12 Q 20 8 25 12 Q 20 16 25 20 Q 20 24 15 20 Q 20 16 15 12"
            fill="#673AB7"
            opacity="0.8"
          />
          <Circle cx="18" cy="14" r="1" fill="white" />
          <Circle cx="22" cy="18" r="1.5" fill="white" />
          <Circle cx="18" cy="22" r="1" fill="white" />
        </G>

        {/* Water intake */}
        <G transform="translate(220, 160)">
          <Circle cx="15" cy="15" r="16" fill="white" opacity="0.95" />
          <Path
            d="M 10 20 Q 15 5 20 20 Q 15 25 10 20"
            fill="#2196F3"
            opacity="0.8"
          />
          <Circle cx="15" cy="18" r="2" fill="white" opacity="0.6" />
        </G>

        {/* Temperature/wellness */}
        <G transform="translate(60, 180)">
          <Circle cx="15" cy="15" r="16" fill="white" opacity="0.95" />
          <Rect x="13" y="8" width="3" height="12" rx="1.5" fill="#FF5722" />
          <Circle cx="14.5" cy="22" r="4" fill="#FF5722" />
          <Path d="M 14.5 12 L 14.5 20" stroke="white" strokeWidth="1" />
        </G>

        {/* Notification badges */}
        <Circle cx="210" cy="90" r="8" fill="#4CAF50" />
        <Path
          d="M 206 90 L 208 92 L 214 86"
          stroke="white"
          strokeWidth="2"
          fill="none"
        />

        <Circle cx="70" cy="100" r="8" fill="#FF5722" />
        <Path
          d="M 70 96 L 70 100 M 67 90 L 73 90"
          stroke="white"
          strokeWidth="2"
        />

        {/* Phone notifications/messages interface */}
        <G transform="translate(100, 200)">
          <Rect
            x="0"
            y="0"
            width="80"
            height="60"
            rx="12"
            fill="white"
            opacity="0.95"
          />

          {/* Message bubbles */}
          <Rect x="10" y="10" width="40" height="12" rx="6" fill="#E3F2FD" />
          <Rect x="30" y="25" width="35" height="12" rx="6" fill="#6892FF" />
          <Rect x="15" y="40" width="30" height="12" rx="6" fill="#E3F2FD" />

          {/* Chat icon */}
          <Circle cx="65" cy="35" r="8" fill="#4CAF50" />
          <Path
            d="M 61 32 L 69 32 M 61 38 L 66 38"
            stroke="white"
            strokeWidth="1"
          />
        </G>

        {/* Activity rings */}
        <G transform="translate(30, 50)">
          <Circle
            cx="15"
            cy="15"
            r="12"
            fill="none"
            stroke="#FF5722"
            strokeWidth="3"
            opacity="0.8"
          />
          <Circle
            cx="15"
            cy="15"
            r="8"
            fill="none"
            stroke="#4CAF50"
            strokeWidth="3"
            opacity="0.8"
          />
          <Circle
            cx="15"
            cy="15"
            r="4"
            fill="none"
            stroke="#2196F3"
            strokeWidth="3"
            opacity="0.8"
          />
        </G>

        {/* Wellness progress bar */}
        <G transform="translate(190, 210)">
          <Rect x="0" y="10" width="60" height="8" rx="4" fill="#E0E0E0" />
          <Rect x="0" y="10" width="45" height="8" rx="4" fill="#4CAF50" />
          <Circle cx="45" cy="14" r="6" fill="white" />
          <Circle cx="45" cy="14" r="4" fill="#4CAF50" />
        </G>

        {/* Floating plus signs for health */}
        <Path
          d="M 240 50 L 245 50 M 242.5 47.5 L 242.5 52.5"
          stroke="#4CAF50"
          strokeWidth="2"
        />
        <Path
          d="M 30 240 L 35 240 M 32.5 237.5 L 32.5 242.5"
          stroke="#2196F3"
          strokeWidth="2"
        />
        <Path
          d="M 250 130 L 255 130 M 252.5 127.5 L 252.5 132.5"
          stroke="#FF5722"
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
