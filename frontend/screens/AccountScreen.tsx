import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  ScrollView,
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

interface AccountScreenProps {
  onBack?: () => void;
}

interface AccountItemProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isEditable?: boolean;
}

const AccountItem: React.FC<AccountItemProps> = ({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
  isEditable = false,
}) => (
  <TouchableOpacity
    style={styles.accountItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.accountItemLeft}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={20} color={colors.primary} />
      </View>
      <View style={styles.accountTextContainer}>
        <Text style={styles.accountLabel}>{label}</Text>
        {value && <Text style={styles.accountValue}>{value}</Text>}
      </View>
    </View>

    <View style={styles.accountItemRight}>
      {isEditable && <Text style={styles.editText}>Modifier</Text>}
      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      )}
    </View>
  </TouchableOpacity>
);

export const AccountScreen: React.FC<AccountScreenProps> = ({ onBack }) => {
  const { user } = useAuth();

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleEditUsername = () => {
    Alert.alert(
      "Modifier le nom d'utilisateur",
      "Fonctionnalité à venir : modification du nom d'utilisateur",
      [{ text: "OK" }],
    );
  };

  const handleEditEmail = () => {
    Alert.alert(
      "Modifier l'email",
      "Fonctionnalité à venir : modification de l'email",
      [{ text: "OK" }],
    );
  };

  const handleEditPhone = () => {
    Alert.alert(
      "Modifier le téléphone",
      "Fonctionnalité à venir : modification du numéro de téléphone",
      [{ text: "OK" }],
    );
  };

  const handleEditBio = () => {
    Alert.alert(
      "Modifier la bio",
      "Fonctionnalité à venir : modification de la bio",
      [{ text: "OK" }],
    );
  };

  const handleAccountDeletion = () => {
    Alert.alert(
      "Supprimer le compte",
      "Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Confirmation requise",
              "Fonctionnalité à venir : suppression du compte",
              [{ text: "OK" }],
            );
          },
        },
      ],
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
        <Text style={styles.headerTitle}>Informations du compte</Text>
        <View style={styles.headerSpacer} />
      </FadeInView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Informations de base */}
        <FadeInView delay={200}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations de base</Text>
            <View style={styles.sectionContent}>
              <AccountItem
                icon="person-outline"
                label="Nom d'utilisateur"
                value={user?.username}
                onPress={handleEditUsername}
                isEditable={true}
              />

              <View style={styles.separator} />

              <AccountItem
                icon="mail-outline"
                label="Adresse email"
                value={user?.email}
                onPress={handleEditEmail}
                isEditable={true}
              />

              <View style={styles.separator} />

              <AccountItem
                icon="call-outline"
                label="Numéro de téléphone"
                value="Non renseigné"
                onPress={handleEditPhone}
                isEditable={true}
              />

              <View style={styles.separator} />

              <AccountItem
                icon="body-outline"
                label="Sexe"
                value={user?.sex || "Non renseigné"}
                showChevron={false}
              />

              <View style={styles.separator} />

              <AccountItem
                icon="calendar-outline"
                label="Date de naissance"
                value={user?.date_of_birth || "Non renseignée"}
                showChevron={false}
              />
            </View>
          </View>
        </FadeInView>

        {/* Informations personnelles */}
        <FadeInView delay={300}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>
            <View style={styles.sectionContent}>
              <AccountItem
                icon="chatbubble-outline"
                label="Bio"
                value="Aucune bio renseignée"
                onPress={handleEditBio}
                isEditable={true}
              />
            </View>
          </View>
        </FadeInView>

        {/* Informations du compte */}
        <FadeInView delay={400}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations du compte</Text>
            <View style={styles.sectionContent}>
              <AccountItem
                icon="time-outline"
                label="Membre depuis"
                value="Janvier 2025"
                showChevron={false}
              />

              <View style={styles.separator} />

              <AccountItem
                icon="shield-checkmark-outline"
                label="Statut du compte"
                value="Vérifié"
                showChevron={false}
              />
            </View>
          </View>
        </FadeInView>

        {/* Actions du compte */}
        <FadeInView delay={500}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions du compte</Text>
            <View style={styles.sectionContent}>
              <AccountItem
                icon="download-outline"
                label="Exporter mes données"
                onPress={() => Alert.alert("Export", "Fonctionnalité à venir")}
              />

              <View style={styles.separator} />

              <AccountItem
                icon="trash-outline"
                label="Supprimer mon compte"
                onPress={handleAccountDeletion}
                showChevron={false}
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
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.04)",
  },
  accountItemLeft: {
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
  accountTextContainer: {
    flex: 1,
  },
  accountLabel: {
    fontSize: typography.body,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  accountValue: {
    fontSize: typography.footnote,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  accountItemRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: spacing.md,
  },
  editText: {
    fontSize: typography.footnote,
    color: colors.primary,
    fontWeight: typography.weights.medium,
    marginRight: spacing.sm,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    marginHorizontal: spacing.lg,
  },
});
