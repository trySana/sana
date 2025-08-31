import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  GradientBackground,
  FadeInView,
  BottomSheet,
  VoiceButton,
} from "../components/common";
import { DashboardContent } from "../components/dashboard";
import {
  colors,
  typography,
  spacing,
  dimensions,
  shadows,
  borderRadius,
} from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";

interface HomeScreenProps {
  userName?: string;
  userImage?: string;
  onVoicePress?: () => void;
  onProfilePress?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userName = "Thibaud",
  userImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  onVoicePress,
  onProfilePress,
}) => {
  const { user } = useAuth();

  const handleRecordingStart = () => {
    console.log("🎤 Enregistrement démarré");
  };

  const handleRecordingStop = () => {
    console.log("🛑 Enregistrement arrêté");
  };

  const handleProcessing = () => {
    console.log("🤖 Traitement IA en cours...");
  };

  const handleResponse = (success: boolean) => {
    if (success) {
      console.log("✅ Réponse reçue avec succès");
    } else {
      console.log("❌ Erreur lors de la réponse");
    }
  };

  const handleError = (error: string) => {
    console.error("❌ Erreur:", error);
    Alert.alert("Erreur", error);
  };

  return (
    <GradientBackground variant="main" style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={Platform.OS === "android"}
      />

      {/* Header avec nom et photo */}
      <FadeInView delay={100} style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.nameText}>{user?.username || userName} .</Text>
        </View>

        <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
          {userImage ? (
            <Image
              source={{ uri: userImage }}
              style={styles.profileImage}
              onError={() => console.log("Profile image failed to load")}
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profileInitials}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </FadeInView>

      {/* Zone centrale avec bouton micro */}
      <View style={styles.centralZone}>
        <FadeInView delay={200} style={styles.voiceButtonContainer}>
          <VoiceButton
            size="large"
            onRecordingStart={handleRecordingStart}
            onRecordingStop={handleRecordingStop}
            onProcessing={handleProcessing}
            onResponse={handleResponse}
            onError={handleError}
          />
        </FadeInView>
      </View>

      {/* Bottom Sheet avec Dashboard */}
      <BottomSheet
        title="Mon Dashboard"
        onClose={() => console.log("BottomSheet fermé")}
        snapPoints={[0.08, 0.6, 0.9]}
        initialSnapIndex={0}
      >
        <DashboardContent
          onChatPress={() => console.log("Chat pressé depuis dashboard")}
        />
      </BottomSheet>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? dimensions.safeAreaTop + 10 : 30,
    paddingBottom: 0,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: typography.largeTitle,
    fontWeight: typography.weights.semiBold,
    color: colors.textPrimary,
    lineHeight: typography.largeTitle * 1.2,
    letterSpacing: -0.5,
  },
  nameText: {
    fontSize: typography.largeTitle,
    fontWeight: typography.weights.semiBold,
    color: colors.textPrimary,
    lineHeight: typography.largeTitle * 1.2,
    letterSpacing: -0.5,
  },
  profileButton: {
    marginLeft: spacing.md,
    marginTop: spacing.xs,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  profilePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },
  profileInitials: {
    fontSize: 20,
    fontWeight: typography.weights.semiBold,
    color: colors.white,
  },
  centralZone: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: spacing.xxxl,
  },
  voiceButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  voiceButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.lg,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomSheetContent: {
    flex: 1,
  },
  infoText: {
    fontSize: typography.body,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
    lineHeight: typography.body * 1.5,
    marginBottom: spacing.xl,
  },
  featureList: {
    gap: spacing.lg,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  featureText: {
    fontSize: typography.callout,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    marginLeft: spacing.md,
    flex: 1,
  },
});
