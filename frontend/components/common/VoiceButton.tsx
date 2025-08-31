import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, shadows } from "../../constants/theme";
import { AudioRecorder } from "./AudioRecorder";
import { audioService } from "../../services/audioService";

interface VoiceButtonProps {
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  onProcessing?: () => void;
  onResponse?: (success: boolean) => void;
  onError?: (error: string) => void;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onRecordingStart,
  onRecordingStop,
  onProcessing,
  onResponse,
  onError,
  size = "medium",
  disabled = false,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);

  // Gestionnaire pour l'enregistrement terminé
  const handleAudioReady = (uri: string) => {
    console.log("🎵 Audio prêt:", uri);
    setAudioUri(uri);

    // Commencer le traitement automatiquement
    handleSendToBackend(uri);
  };

  // Gestionnaire pour l'envoi au backend
  const handleSendToBackend = async (uri: string) => {
    try {
      setIsProcessing(true);
      onProcessing?.();

      console.log("🚀 Envoi de l'audio au backend...");

      // Envoyer au backend
      const response = await audioService.sendAudioToBackend(uri);

      if (!response.success) {
        throw new Error(response.error || "Erreur lors de l'envoi au backend");
      }

      // Jouer la réponse
      if (response.audioData) {
        await audioService.playAudioResponse(response.audioData);
      }

      setIsProcessing(false);
      onResponse?.(true);

      Alert.alert(
        "Conversation réussie",
        "Votre message a été traité et une réponse audio a été générée.",
        [{ text: "OK" }],
      );
    } catch (error) {
      setIsProcessing(false);
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      console.error("❌ Erreur:", errorMessage);
      onError?.(errorMessage);
      Alert.alert("Erreur", errorMessage);
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case "small":
        return { width: 48, height: 48, iconSize: 20 };
      case "large":
        return { width: 80, height: 80, iconSize: 32 };
      default:
        return { width: 64, height: 64, iconSize: 24 };
    }
  };

  const { width, height, iconSize } = getButtonSize();

  const getIconName = () => {
    if (isProcessing) return "hourglass";
    return "mic-outline";
  };

  const getButtonStyle = () => {
    const baseStyle = {
      width,
      height,
      borderRadius: height / 2,
    };

    if (isProcessing) {
      return {
        ...baseStyle,
        backgroundColor: colors.warning,
        ...shadows.lg,
      };
    }

    return {
      ...baseStyle,
      backgroundColor: colors.white,
      ...shadows.lg,
    };
  };

  if (disabled) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, getButtonStyle(), styles.disabledButton]}
          disabled={true}
        >
          <Ionicons
            name="mic-off"
            size={iconSize}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <Text style={styles.statusText}>Micro désactivé</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isProcessing ? (
        // Affichage du traitement
        <TouchableOpacity
          style={[styles.button, getButtonStyle()]}
          disabled={true}
        >
          <ActivityIndicator size={iconSize} color={colors.white} />
        </TouchableOpacity>
      ) : (
        // Enregistreur audio
        <AudioRecorder
          onRecordingStart={onRecordingStart}
          onRecordingStop={onRecordingStop}
          onAudioReady={handleAudioReady}
          onError={onError}
        />
      )}

      {/* Indicateur de statut */}
      <View style={styles.statusContainer}>
        {isProcessing && (
          <Text style={styles.statusText}>Traitement IA...</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  statusContainer: {
    marginTop: spacing.sm,
    alignItems: "center",
  },
  statusText: {
    fontSize: typography.caption1,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
});
