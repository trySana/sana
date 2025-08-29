import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GradientBackground, FadeInView } from "../components/common";
import {
  colors,
  typography,
  spacing,
  dimensions,
  shadows,
  borderRadius,
} from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";

interface SecurityScreenProps {
  onBack?: () => void;
}

interface SecurityItemProps {
  icon: string;
  label: string;
  description?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  showChevron?: boolean;
  isDestructive?: boolean;
}

const SecurityItem: React.FC<SecurityItemProps> = ({
  icon,
  label,
  description,
  hasSwitch = false,
  switchValue = false,
  onSwitchChange,
  onPress,
  showChevron = true,
  isDestructive = false,
}) => (
  <TouchableOpacity
    style={styles.securityItem}
    onPress={onPress}
    disabled={hasSwitch}
    activeOpacity={hasSwitch ? 1 : 0.7}
  >
    <View style={styles.securityItemLeft}>
      <View
        style={[
          styles.iconContainer,
          isDestructive && styles.iconContainerDestructive,
        ]}
      >
        <Ionicons
          name={icon as any}
          size={20}
          color={isDestructive ? colors.white : colors.primary}
        />
      </View>
      <View style={styles.securityTextContainer}>
        <Text style={styles.securityLabel}>{label}</Text>
        {description && (
          <Text style={styles.securityDescription}>{description}</Text>
        )}
      </View>
    </View>

    <View style={styles.securityItemRight}>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: "#E0E0E0", true: colors.primary }}
          thumbColor={colors.white}
          style={styles.switch}
        />
      ) : (
        showChevron && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        )
      )}
    </View>
  </TouchableOpacity>
);

export const SecurityScreen: React.FC<SecurityScreenProps> = ({ onBack }) => {
  const { user } = useAuth();

  // États de sécurité
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleChangePassword = () => {
    Alert.alert(
      "Changer le mot de passe",
      "Fonctionnalité à venir : changement de mot de passe",
      [{ text: "OK" }],
    );
  };

  const handleTwoFactorAuth = () => {
    Alert.alert(
      "Authentification à deux facteurs",
      "Fonctionnalité à venir : configuration 2FA",
      [{ text: "OK" }],
    );
  };

  const handleLoginHistory = () => {
    Alert.alert(
      "Historique de connexion",
      "Fonctionnalité à venir : affichage de l'historique",
      [{ text: "OK" }],
    );
  };

  const handleActiveSessions = () => {
    Alert.alert(
      "Sessions actives",
      "Fonctionnalité à venir : gestion des sessions",
      [{ text: "OK" }],
    );
  };

  return (
    <GradientBackground variant="main" style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={Platform.OS === "android"}
      />

      {/* Header */}
      <FadeInView delay={100} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sécurité</Text>
        <View style={styles.headerSpacer} />
      </FadeInView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Authentification */}
        <FadeInView delay={200}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Authentification</Text>
            <View style={styles.sectionContent}>
              <SecurityItem
                icon="key-outline"
                label="Changer le mot de passe"
                description="Mettre à jour votre mot de passe"
                onPress={handleChangePassword}
              />

              <View style={styles.separator} />

              <SecurityItem
                icon="finger-print-outline"
                label="Authentification biométrique"
                description="Utiliser l'empreinte digitale ou Face ID"
                hasSwitch={true}
                switchValue={biometricAuth}
                onSwitchChange={setBiometricAuth}
                showChevron={false}
              />

              <View style={styles.separator} />

              <SecurityItem
                icon="shield-checkmark-outline"
                label="Authentification à deux facteurs"
                description="Ajouter une couche de sécurité"
                hasSwitch={true}
                switchValue={twoFactorAuth}
                onSwitchChange={setTwoFactorAuth}
                showChevron={false}
              />
            </View>
          </View>
        </FadeInView>

        {/* Notifications de sécurité */}
        <FadeInView delay={300}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications de sécurité</Text>
            <View style={styles.sectionContent}>
              <SecurityItem
                icon="notifications-outline"
                label="Alertes de connexion"
                description="Recevoir une notification à chaque connexion"
                hasSwitch={true}
                switchValue={loginNotifications}
                onSwitchChange={setLoginNotifications}
                showChevron={false}
              />
            </View>
          </View>
        </FadeInView>

        {/* Sessions et historique */}
        <FadeInView delay={400}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sessions et historique</Text>
            <View style={styles.sectionContent}>
              <SecurityItem
                icon="time-outline"
                label="Historique de connexion"
                description="Voir vos connexions récentes"
                onPress={handleLoginHistory}
              />

              <View style={styles.separator} />

              <SecurityItem
                icon="phone-portrait-outline"
                label="Sessions actives"
                description="Gérer vos appareils connectés"
                onPress={handleActiveSessions}
              />
            </View>
          </View>
        </FadeInView>

        {/* Espacement en bas */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop:
      Platform.OS === "ios" ? dimensions.safeAreaTop + spacing.md : spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.title3,
    fontWeight: typography.weights.semiBold,
    color: colors.textPrimary,
    textAlign: "center",
    marginHorizontal: spacing.md,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.title3,
    fontWeight: typography.weights.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  sectionContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.sm,
  },
  securityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.04)",
  },
  securityItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  iconContainerDestructive: {
    backgroundColor: colors.error,
  },
  securityTextContainer: {
    flex: 1,
  },
  securityLabel: {
    fontSize: typography.body,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  securityDescription: {
    fontSize: typography.footnote,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  securityItemRight: {
    marginLeft: spacing.md,
  },
  switch: {
    transform: [{ scale: 0.9 }],
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    marginHorizontal: spacing.lg,
  },
});
