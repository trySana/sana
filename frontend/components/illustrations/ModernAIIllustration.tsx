import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Path, Rect, G, Ellipse } from "react-native-svg";

interface ModernAIIllustrationProps {
  size?: number;
}

export const ModernAIIllustration: React.FC<ModernAIIllustrationProps> = ({
  size = 280,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 280 280">
        {/* Background elements */}
        <Circle cx="60" cy="70" r="20" fill="#E8EAF6" opacity="0.6" />
        <Ellipse
          cx="220"
          cy="80"
          rx="25"
          ry="15"
          fill="#FFF3E0"
          opacity="0.7"
        />
        <Circle cx="50" cy="200" r="18" fill="#E0F2F1" opacity="0.5" />
        <Circle cx="240" cy="190" r="15" fill="#FCE4EC" opacity="0.6" />

        {/* Main person - holding phone */}
        {/* Head */}
        <Circle cx="140" cy="80" r="22" fill="#FFAB91" />

        {/* Hair - curly/textured */}
        <Path
          d="M 120 65 Q 140 45 160 65 Q 155 80 140 80 Q 125 80 120 65"
          fill="#8D6E63"
        />

        {/* Body - red/orange top */}
        <Rect x="118" y="102" width="44" height="55" rx="22" fill="#FF5722" />

        {/* Arms */}
        <Ellipse cx="100" cy="125" rx="10" ry="22" fill="#FFAB91" />
        <Ellipse cx="180" cy="125" rx="10" ry="22" fill="#FFAB91" />

        {/* Pants - black */}
        <Rect x="125" y="157" width="30" height="45" rx="15" fill="#263238" />

        {/* Legs */}
        <Ellipse cx="132" cy="220" rx="7" ry="18" fill="#FFAB91" />
        <Ellipse cx="148" cy="220" rx="7" ry="18" fill="#FFAB91" />

        {/* Shoes - colorful */}
        <Ellipse cx="132" cy="245" rx="10" ry="7" fill="#FF9800" />
        <Ellipse cx="148" cy="245" rx="10" ry="7" fill="#FF9800" />

        {/* Phone in hand with AI interface */}
        <Rect x="160" y="115" width="22" height="35" rx="5" fill="#37474F" />
        <Rect x="162" y="117" width="18" height="31" rx="3" fill="#2196F3" />

        {/* AI analysis on screen */}
        <Circle cx="171" cy="125" r="3" fill="white" />
        <Path
          d="M 167 133 L 175 133 M 165 138 L 177 138"
          stroke="white"
          strokeWidth="1"
        />
        <Circle cx="168" cy="143" r="1" fill="#4CAF50" />
        <Circle cx="174" cy="143" r="1" fill="#FF5722" />

        {/* Question mark above head */}
        <G transform="translate(190, 40)">
          <Circle cx="15" cy="25" r="18" fill="white" opacity="0.9" />
          <Path
            d="M 10 15 Q 15 10 20 15 Q 20 20 15 20 M 15 25 L 15 26"
            stroke="#9C27B0"
            strokeWidth="2"
            fill="none"
          />
        </G>

        {/* Floating symptoms/data */}
        {/* Symptom 1 - Temperature */}
        <G transform="translate(80, 60)">
          <Circle cx="15" cy="15" r="12" fill="#FF5722" opacity="0.8" />
          <Rect x="13" y="8" width="2" height="10" fill="white" />
          <Circle cx="14" cy="20" r="3" fill="white" />
        </G>

        {/* Symptom 2 - Heart */}
        <G transform="translate(220, 50)">
          <Circle cx="15" cy="15" r="12" fill="#E91E63" opacity="0.8" />
          <Path
            d="M 10 12 C 10 9 12 7 15 10 C 18 7 20 9 20 12 C 20 17 15 20 15 20 C 15 20 10 17 10 12 Z"
            fill="white"
          />
        </G>

        {/* Symptom 3 - Head/pain */}
        <G transform="translate(40, 130)">
          <Circle cx="15" cy="15" r="12" fill="#FF9800" opacity="0.8" />
          <Circle cx="15" cy="15" r="6" fill="white" />
          <Path
            d="M 15 10 L 15 20 M 10 15 L 20 15"
            stroke="#FF9800"
            strokeWidth="2"
          />
        </G>

        {/* AI Brain processing center */}
        <G transform="translate(90, 160)">
          <Circle cx="50" cy="30" r="25" fill="#673AB7" opacity="0.9" />

          {/* Brain pattern */}
          <Path
            d="M 35 25 Q 50 15 65 25 Q 50 35 65 45 Q 50 55 35 45 Q 50 35 35 25"
            stroke="white"
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />

          {/* Neural connections */}
          <Circle cx="40" cy="20" r="2" fill="#FFC107" />
          <Circle cx="60" cy="25" r="2" fill="#4CAF50" />
          <Circle cx="45" cy="40" r="2" fill="#FF5722" />
          <Circle cx="55" cy="35" r="2" fill="#2196F3" />

          {/* Connection lines */}
          <Path
            d="M 40 20 L 60 25 M 60 25 L 55 35 M 55 35 L 45 40 M 45 40 L 40 20"
            stroke="white"
            strokeWidth="1"
            opacity="0.6"
          />
        </G>

        {/* Analysis results */}
        <G transform="translate(180, 180)">
          <Rect
            x="0"
            y="0"
            width="70"
            height="50"
            rx="10"
            fill="white"
            opacity="0.95"
          />
          <Path
            d="M 15 15 L 20 20 L 30 10"
            stroke="#4CAF50"
            strokeWidth="3"
            fill="none"
          />
          <Path
            d="M 40 15 L 60 15 M 40 25 L 55 25 M 40 35 L 50 35"
            stroke="#E0E0E0"
            strokeWidth="2"
          />
        </G>

        {/* Data flow particles */}
        <Circle cx="110" cy="100" r="2" fill="#2196F3" opacity="0.7" />
        <Circle cx="170" cy="90" r="2" fill="#FF5722" opacity="0.7" />
        <Circle cx="200" cy="130" r="2" fill="#4CAF50" opacity="0.7" />
        <Circle cx="80" cy="180" r="2" fill="#FF9800" opacity="0.7" />
        <Circle cx="220" cy="170" r="2" fill="#9C27B0" opacity="0.7" />

        {/* Loading/processing indicators */}
        <G transform="translate(60, 240)">
          <Circle cx="5" cy="5" r="3" fill="#2196F3" opacity="0.8" />
          <Circle cx="15" cy="5" r="3" fill="#2196F3" opacity="0.6" />
          <Circle cx="25" cy="5" r="3" fill="#2196F3" opacity="0.4" />
        </G>

        <G transform="translate(180, 240)">
          <Circle cx="5" cy="5" r="3" fill="#FF5722" opacity="0.8" />
          <Circle cx="15" cy="5" r="3" fill="#FF5722" opacity="0.6" />
          <Circle cx="25" cy="5" r="3" fill="#FF5722" opacity="0.4" />
        </G>
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
