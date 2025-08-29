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

interface PrivacyScreenProps {
  onBack?: () => void;
}

interface PrivacyItemProps {
  icon: string;
  label: string;
  description?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  showChevron?: boolean;
}

const PrivacyItem: React.FC<PrivacyItemProps> = ({
  icon,
  label,
  description,
  hasSwitch = false,
  switchValue = false,
  onSwitchChange,
  onPress,
  showChevron = true,
}) => (
  <TouchableOpacity
    style={styles.privacyItem}
    onPress={onPress}
    disabled={hasSwitch}
    activeOpacity={hasSwitch ? 1 : 0.7}
  >
    <View style={styles.privacyItemLeft}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={20} color={colors.primary} />
      </View>
      <View style={styles.privacyTextContainer}>
        <Text style={styles.privacyLabel}>{label}</Text>
        {description && (
          <Text style={styles.privacyDescription}>{description}</Text>
        )}
      </View>
    </View>

    <View style={styles.privacyItemRight}>
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

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ onBack }) => {
  const { user } = useAuth();

  // États de confidentialité
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleDataExport = () => {
    Alert.alert(
      "Exporter mes données",
      "Fonctionnalité à venir : export de vos données personnelles",
      [{ text: "OK" }],
    );
  };

  const handleDataDeletion = () => {
    Alert.alert(
      "Supprimer mes données",
      "Fonctionnalité à venir : suppression de vos données personnelles",
      [{ text: "OK" }],
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      "Politique de confidentialité",
      "Fonctionnalité à venir : affichage de la politique de confidentialité",
      [{ text: "OK" }],
    );
  };

  const handleTermsOfService = () => {
    Alert.alert(
      "Conditions d'utilisation",
      "Fonctionnalité à venir : affichage des conditions d'utilisation",
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
        <Text style={styles.headerTitle}>Confidentialité</Text>
        <View style={styles.headerSpacer} />
      </FadeInView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Visibilité du profil */}
        <FadeInView delay={200}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Visibilité du profil</Text>
            <View style={styles.sectionContent}>
              <PrivacyItem
                icon="eye-outline"
                label="Profil public"
                description="Permettre aux autres de voir votre profil"
                hasSwitch={true}
                switchValue={profileVisibility}
                onSwitchChange={setProfileVisibility}
                showChevron={false}
              />
            </View>
          </View>
        </FadeInView>

        {/* Partage de données */}
        <FadeInView delay={300}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Partage de données</Text>
            <View style={styles.sectionContent}>
              <PrivacyItem
                icon="share-outline"
                label="Partage de données"
                description="Partager des données avec nos partenaires"
                hasSwitch={true}
                switchValue={dataSharing}
                onSwitchChange={setDataSharing}
                showChevron={false}
              />

              <View style={styles.separator} />

              <PrivacyItem
                icon="analytics-outline"
                label="Analytics et rapports"
                description="Collecter des données d'utilisation pour améliorer l'app"
                hasSwitch={true}
                switchValue={analytics}
                onSwitchChange={setAnalytics}
                showChevron={false}
              />

              <View style={styles.separator} />

              <PrivacyItem
                icon="megaphone-outline"
                label="Publicités personnalisées"
                description="Recevoir des publicités basées sur vos intérêts"
                hasSwitch={true}
                switchValue={personalizedAds}
                onSwitchChange={setPersonalizedAds}
                showChevron={false}
              />
            </View>
          </View>
        </FadeInView>

        {/* Gestion des données */}
        <FadeInView delay={400}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gestion des données</Text>
            <View style={styles.sectionContent}>
              <PrivacyItem
                icon="download-outline"
                label="Exporter mes données"
                description="Télécharger une copie de vos données"
                onPress={handleDataExport}
              />

              <View style={styles.separator} />

              <PrivacyItem
                icon="trash-outline"
                label="Supprimer mes données"
                description="Supprimer définitivement vos données"
                onPress={handleDataDeletion}
              />
            </View>
          </View>
        </FadeInView>

        {/* Documents légaux */}
        <FadeInView delay={500}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documents légaux</Text>
            <View style={styles.sectionContent}>
              <PrivacyItem
                icon="document-text-outline"
                label="Politique de confidentialité"
                description="Lire notre politique de confidentialité"
                onPress={handlePrivacyPolicy}
              />

              <View style={styles.separator} />

              <PrivacyItem
                icon="reader-outline"
                label="Conditions d'utilisation"
                description="Lire nos conditions d'utilisation"
                onPress={handleTermsOfService}
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
  privacyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.04)",
  },
  privacyItemLeft: {
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
  privacyTextContainer: {
    flex: 1,
  },
  privacyLabel: {
    fontSize: typography.body,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  privacyDescription: {
    fontSize: typography.footnote,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  privacyItemRight: {
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
