import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GradientBackground, FadeInView, Button } from "../components/common";
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
  const { user, updateProfile } = useAuth();

  // État pour la modal d'édition
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<{
    type: string;
    label: string;
    currentValue: string;
    placeholder: string;
    keyboardType?: "default" | "email-address" | "phone-pad";
    multiline?: boolean;
    maxLength?: number;
  } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const openEditModal = (field: {
    type: string;
    label: string;
    currentValue: string;
    placeholder: string;
    keyboardType?: "default" | "email-address" | "phone-pad";
    multiline?: boolean;
    maxLength?: number;
  }) => {
    setEditingField(field);
    setEditValue(field.currentValue);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingField(null);
    setEditValue("");
    setIsLoading(false);
  };

  const handleSaveEdit = async () => {
    if (!editingField || !editValue.trim()) return;

    try {
      setIsLoading(true);

      // Préparer les données de mise à jour
      const updateData: any = {};
      const fieldName =
        editingField.type === "phone" ? "phone_number" : editingField.type;
      updateData[fieldName] = editValue.trim();

      // Mettre à jour le profil via l'API
      await updateProfile(updateData);

      Alert.alert(
        "Modification réussie",
        `${editingField.label} a été modifié avec succès !`,
        [{ text: "OK", onPress: closeEditModal }],
      );
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.userMessage || "Impossible de modifier cette information",
        [{ text: "OK" }],
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUsername = () => {
    openEditModal({
      type: "username",
      label: "Nom d'utilisateur",
      currentValue: user?.username || "",
      placeholder: "Votre nom d'utilisateur",
      maxLength: 20,
    });
  };

  const handleEditEmail = () => {
    openEditModal({
      type: "email",
      label: "Adresse email",
      currentValue: user?.email || "",
      placeholder: "votre@email.com",
      keyboardType: "email-address",
    });
  };

  const handleEditPhone = () => {
    openEditModal({
      type: "phone",
      label: "Numéro de téléphone",
      currentValue: "Non renseigné",
      placeholder: "+33 6 12 34 56 78",
      keyboardType: "phone-pad",
      maxLength: 15,
    });
  };

  const handleEditBio = () => {
    openEditModal({
      type: "bio",
      label: "Bio",
      currentValue: "Aucune bio renseignée",
      placeholder: "Parlez-nous de vous...",
      multiline: true,
      maxLength: 500,
    });
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

              <View style={styles.separator} />

              {/* Bouton de débogage temporaire */}
              <TouchableOpacity
                style={styles.debugButton}
                onPress={async () => {
                  try {
                    const { SessionManager } = await import(
                      "../services/sessionManager"
                    );
                    const isPersistent =
                      await SessionManager.checkSessionPersistence();
                    const session = await SessionManager.getSession();

                    Alert.alert(
                      "Débogage Session",
                      `Persistance: ${isPersistent ? "OK" : "ÉCHEC"}\n` +
                        `Session: ${session ? "Trouvée" : "Non trouvée"}\n` +
                        `User: ${session?.user?.username || "N/A"}\n` +
                        `Token: ${session?.token ? "Présent" : "Absent"}`,
                    );
                  } catch (error) {
                    Alert.alert("Erreur", `Erreur de débogage: ${error}`);
                  }
                }}
              >
                <View style={styles.debugButtonContent}>
                  <Ionicons
                    name="bug-outline"
                    size={20}
                    color={colors.warning}
                  />
                  <Text style={styles.debugButtonText}>Déboguer Session</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.separator} />

              {/* Bouton de test de session */}
              <TouchableOpacity
                style={styles.testButton}
                onPress={async () => {
                  try {
                    const { testSessionPersistence, testSessionPerformance } =
                      await import("../utils/sessionTest");

                    Alert.alert(
                      "Tests de Session",
                      "Choisissez un test à exécuter:",
                      [
                        {
                          text: "Test Persistance",
                          onPress: async () => {
                            const result = await testSessionPersistence();
                            Alert.alert(
                              "Test Persistance",
                              result
                                ? "✅ SUCCÈS: Session persistante"
                                : "❌ ÉCHEC: Session non persistante",
                            );
                          },
                        },
                        {
                          text: "Test Performance",
                          onPress: async () => {
                            const result = await testSessionPerformance();
                            if (result.success && result.avgTime) {
                              Alert.alert(
                                "Test Performance",
                                `✅ SUCCÈS\nDurée: ${result.duration}ms\nMoyenne: ${result.avgTime.toFixed(2)}ms`,
                              );
                            } else {
                              Alert.alert(
                                "Test Performance",
                                `❌ ÉCHEC: ${result.error || "Erreur inconnue"}`,
                              );
                            }
                          },
                        },
                        { text: "Annuler", style: "cancel" },
                      ],
                    );
                  } catch (error) {
                    Alert.alert("Erreur", `Erreur lors du test: ${error}`);
                  }
                }}
              >
                <View style={styles.testButtonContent}>
                  <Ionicons
                    name="flask-outline"
                    size={20}
                    color={colors.info}
                  />
                  <Text style={styles.testButtonText}>Tests de Session</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </FadeInView>

        {/* Espacement en bas */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modal d'édition */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalContainer}>
          {/* Header de la modal */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={closeEditModal}
            >
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>
              Modifier {editingField?.label}
            </Text>
            <View style={styles.modalHeaderSpacer} />
          </View>

          {/* Contenu de la modal */}
          <View style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{editingField?.label}</Text>
              <TextInput
                style={[
                  styles.textInput,
                  editingField?.multiline && styles.multilineInput,
                ]}
                value={editValue}
                onChangeText={setEditValue}
                placeholder={editingField?.placeholder}
                keyboardType={editingField?.keyboardType || "default"}
                multiline={editingField?.multiline}
                numberOfLines={editingField?.multiline ? 3 : 1}
                maxLength={editingField?.maxLength}
                autoCapitalize={
                  editingField?.type === "email" ||
                  editingField?.type === "username"
                    ? "none"
                    : "sentences"
                }
                autoFocus={true}
              />
            </View>

            {/* Informations d'aide */}
            <View style={styles.helpSection}>
              <View style={styles.helpItem}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={colors.info}
                />
                <Text style={styles.helpText}>
                  {editingField?.type === "username" &&
                    "Le nom d'utilisateur doit être unique et contenir entre 3 et 20 caractères."}
                  {editingField?.type === "email" &&
                    "L'email sera utilisé pour la récupération de compte et les notifications."}
                  {editingField?.type === "phone" &&
                    "Le numéro de téléphone est optionnel et peut être utilisé pour la vérification."}
                  {editingField?.type === "bio" &&
                    "La bio permet de vous présenter aux autres utilisateurs (optionnel)."}
                </Text>
              </View>
            </View>
          </View>

          {/* Boutons d'action */}
          <View style={styles.modalActions}>
            <Button
              title="Sauvegarder"
              onPress={handleSaveEdit}
              style={styles.saveButton}
              loading={isLoading}
              disabled={isLoading}
            />

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={closeEditModal}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  // Styles pour la modal
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: Platform.OS === "ios" ? 50 : spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
    backgroundColor: colors.white,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardBackground,
  },
  modalHeaderTitle: {
    flex: 1,
    fontSize: typography.title3,
    fontWeight: typography.weights.semiBold,
    color: colors.textPrimary,
    textAlign: "center",
    marginHorizontal: spacing.md,
  },
  modalHeaderSpacer: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    fontSize: typography.body,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.separator,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.white,
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  helpSection: {
    marginBottom: spacing.xl,
  },
  helpItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.cardBackground,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.info,
  },
  helpText: {
    flex: 1,
    fontSize: typography.footnote,
    color: colors.textSecondary,
    lineHeight: 18,
    marginLeft: spacing.sm,
  },
  modalActions: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.separator,
    backgroundColor: colors.white,
    gap: spacing.md,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    paddingVertical: spacing.md,
    alignItems: "center",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.separator,
  },
  cancelButtonText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },

  // Styles pour le bouton de débogage
  debugButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  debugButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  debugButtonText: {
    fontSize: typography.body,
    color: colors.warning,
    fontWeight: typography.weights.medium,
  },

  // Styles pour le bouton de test de session
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.info,
  },
  testButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  testButtonText: {
    fontSize: typography.body,
    color: colors.info,
    fontWeight: typography.weights.medium,
  },
});
