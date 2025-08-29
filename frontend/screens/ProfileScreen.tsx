import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { ApiService, HealthInfoRequest } from "../services/api";
import { colors, typography, spacing } from "../constants/theme";
import {
  GradientBackground,
  FadeInView,
  Button,
  Input,
} from "../components/common";

interface ProfileScreenProps {
  userName: string;
  onBack: () => void;
  onNavigateToSettings: () => void;
  onNavigateToEditProfile: () => void;
}

interface HealthFormData {
  height: string;
  weight: string;
  blood_type: string;
  medical_conditions: string;
  allergies: string;
  medications: string;
  smoking_status: string;
  alcohol_consumption: string;
  exercise_frequency: string;
  family_history: string;
}

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const SMOKING_STATUS = ["Jamais", "Ancien fumeur", "Fumeur actuel"];
const ALCOHOL_CONSUMPTION = ["Aucune", "Occasionnelle", "Modérée", "Élevée"];
const EXERCISE_FREQUENCY = [
  "Jamais",
  "Rarement",
  "Parfois",
  "Souvent",
  "Quotidiennement",
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onNavigateToSettings,
  onNavigateToEditProfile,
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [healthData, setHealthData] = useState<HealthFormData>({
    height: "",
    weight: "",
    blood_type: "",
    medical_conditions: "",
    allergies: "",
    medications: "",
    smoking_status: "",
    alcohol_consumption: "",
    exercise_frequency: "",
    family_history: "",
  });

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    if (!user?.username) return;

    try {
      setIsLoading(true);
      console.log(
        `[ProfileScreen] Chargement des données de santé pour ${user.username}`,
      );

      const response = await ApiService.getHealthInfo(user.username);
      console.log(`[ProfileScreen] Réponse reçue:`, response);

      if (response.success && response.health_data) {
        const data = response.health_data;
        console.log(`[ProfileScreen] Données de santé reçues:`, data);

        setHealthData({
          height: data.height?.toString() || "",
          weight: data.weight?.toString() || "",
          blood_type: data.blood_type || "",
          medical_conditions: data.medical_conditions?.join(", ") || "",
          allergies: data.allergies?.join(", ") || "",
          medications: data.medications?.join(", ") || "",
          smoking_status: data.smoking_status || "",
          alcohol_consumption: data.alcohol_consumption || "",
          exercise_frequency: data.exercise_frequency || "",
          family_history: data.family_history?.join(", ") || "",
        });

        console.log(
          `[ProfileScreen] Données mises à jour dans l'état:`,
          healthData,
        );
      } else {
        console.warn(`[ProfileScreen] Réponse sans succès:`, response.message);
        Alert.alert(
          "Information",
          response.message || "Aucune information de santé trouvée",
        );
      }
    } catch (error: any) {
      console.error("Erreur lors du chargement des données de santé:", error);

      let errorMessage = "Erreur lors du chargement des données de santé";
      if (error.userMessage) {
        errorMessage = error.userMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Erreur", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.username) return;

    try {
      setIsLoading(true);
      console.log(
        `[ProfileScreen] Sauvegarde des données de santé pour ${user.username}`,
      );

      // Convertir les données du formulaire
      const healthInfo: HealthInfoRequest = {
        height: healthData.height ? parseInt(healthData.height) : undefined,
        weight: healthData.weight ? parseInt(healthData.weight) : undefined,
        blood_type: healthData.blood_type || undefined,
        medical_conditions: healthData.medical_conditions
          ? healthData.medical_conditions
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : undefined,
        allergies: healthData.allergies
          ? healthData.allergies
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : undefined,
        medications: healthData.medications
          ? healthData.medications
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : undefined,
        smoking_status: healthData.smoking_status || undefined,
        alcohol_consumption: healthData.alcohol_consumption || undefined,
        exercise_frequency: healthData.exercise_frequency || undefined,
        family_history: healthData.family_history
          ? healthData.family_history
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : undefined,
      };

      console.log(`[ProfileScreen] Données à envoyer:`, healthInfo);

      const response = await ApiService.updateHealthInfo(
        user.username,
        healthInfo,
      );

      console.log(`[ProfileScreen] Réponse de sauvegarde:`, response);

      if (response.success) {
        Alert.alert(
          "Succès",
          "Informations de santé mises à jour avec succès",
          [
            {
              text: "OK",
              onPress: () => {
                setIsEditing(false);
                // Recharger les données pour s'assurer qu'elles sont à jour
                loadHealthData();
              },
            },
          ],
        );
      } else {
        Alert.alert("Erreur", response.message || "Échec de la mise à jour");
      }
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);

      let errorMessage = "Impossible de sauvegarder les informations de santé";
      if (error.userMessage) {
        errorMessage = error.userMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Erreur", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadHealthData(); // Recharger les données originales
  };

  const renderField = (
    label: string,
    value: string,
    key: keyof HealthFormData,
    placeholder?: string,
    multiline = false,
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <Input
          value={value}
          onChangeText={(text) =>
            setHealthData((prev) => ({ ...prev, [key]: text }))
          }
          placeholder={placeholder || `Entrez votre ${label.toLowerCase()}`}
          multiline={multiline}
          style={styles.input}
        />
      ) : (
        <View style={styles.fieldValueContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Chargement...</Text>
            </View>
          ) : (
            <Text style={styles.fieldValue}>{value || "Non renseigné"}</Text>
          )}
        </View>
      )}
    </View>
  );

  const renderSelectField = (
    label: string,
    value: string,
    key: keyof HealthFormData,
    options: string[],
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <View style={styles.selectContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.selectOption,
                value === option && styles.selectOptionSelected,
              ]}
              onPress={() =>
                setHealthData((prev) => ({ ...prev, [key]: option }))
              }
            >
              <Text
                style={[
                  styles.selectOptionText,
                  value === option && styles.selectOptionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.fieldValue}>{value || "Non renseigné"}</Text>
      )}
    </View>
  );

  return (
    <GradientBackground variant="main" style={styles.container}>
      <StatusBar
        style="dark"
        backgroundColor="transparent"
        translucent={Platform.OS === "android"}
      />

      {/* Header */}
      <FadeInView delay={100} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil Santé</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={onNavigateToSettings}
        >
          <Ionicons
            name="settings-outline"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </FadeInView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Informations utilisateur */}
        <FadeInView delay={200} style={styles.userSection}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImage}>
              <Ionicons name="person" size={40} color={colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.username || "Utilisateur"}
              </Text>
              <Text style={styles.profileSubtitle}>
                {user?.email || "email@example.com"}
              </Text>
            </View>
          </View>
        </FadeInView>

        {/* Actions */}
        <FadeInView delay={300} style={styles.actionsSection}>
          <Button
            title={isEditing ? "Sauvegarder" : "Modifier le profil"}
            onPress={isEditing ? handleSave : () => setIsEditing(true)}
            variant="primary"
            loading={isLoading}
            style={styles.actionButton}
          />
          {isEditing && (
            <Button
              title="Annuler"
              onPress={handleCancel}
              variant="secondary"
              style={styles.actionButton}
            />
          )}
          {!isEditing && (
            <Button
              title="Rafraîchir les données"
              onPress={loadHealthData}
              variant="secondary"
              loading={isLoading}
              style={styles.actionButton}
            />
          )}
        </FadeInView>

        {/* Informations de santé */}
        <FadeInView delay={400}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations Physiques</Text>
            {renderField("Taille (cm)", healthData.height, "height", "Ex: 175")}
            {renderField("Poids (kg)", healthData.weight, "weight", "Ex: 70")}
            {renderSelectField(
              "Groupe sanguin",
              healthData.blood_type,
              "blood_type",
              BLOOD_TYPES,
            )}
          </View>
        </FadeInView>

        <FadeInView delay={500}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Antécédents Médicaux</Text>
            {renderField(
              "Maladies chroniques",
              healthData.medical_conditions,
              "medical_conditions",
              "Ex: Diabète, Hypertension",
              true,
            )}
            {renderField(
              "Allergies",
              healthData.allergies,
              "allergies",
              "Ex: Pénicilline, Pollen",
              true,
            )}
            {renderField(
              "Médicaments actuels",
              healthData.medications,
              "medications",
              "Ex: Aspirine, Vitamine D",
              true,
            )}
          </View>
        </FadeInView>

        <FadeInView delay={600}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mode de Vie</Text>
            {renderSelectField(
              "Statut tabagique",
              healthData.smoking_status,
              "smoking_status",
              SMOKING_STATUS,
            )}
            {renderSelectField(
              "Consommation d'alcool",
              healthData.alcohol_consumption,
              "alcohol_consumption",
              ALCOHOL_CONSUMPTION,
            )}
            {renderSelectField(
              "Fréquence d'exercice",
              healthData.exercise_frequency,
              "exercise_frequency",
              EXERCISE_FREQUENCY,
            )}
          </View>
        </FadeInView>

        <FadeInView delay={700}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Antécédents Familiaux</Text>
            {renderField(
              "Maladies familiales",
              healthData.family_history,
              "family_history",
              "Ex: Cancer, Maladie cardiaque",
              true,
            )}
          </View>
        </FadeInView>

        {/* Note importante */}
        <FadeInView delay={800}>
          <View style={styles.noteSection}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colors.warning}
            />
            <Text style={styles.noteText}>
              Ces informations nous aident à vous fournir un diagnostic plus
              précis et des recommandations personnalisées.
            </Text>
          </View>
        </FadeInView>
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
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.h2,
    color: colors.textPrimary,
    flex: 1,
    textAlign: "center",
  },
  settingsButton: {
    padding: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  userSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  profileSubtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  actionsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  section: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: spacing.md,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: typography.caption1,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: "600",
  },
  fieldValueContainer: {
    minHeight: 44,
  },
  fieldValue: {
    fontSize: typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.sm,
    textAlignVertical: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: typography.caption1,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.separator,
    borderWidth: 1,
  },
  selectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  selectOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.separator,
  },
  selectOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectOptionText: {
    fontSize: typography.caption1,
    color: colors.textPrimary,
  },
  selectOptionTextSelected: {
    color: colors.white,
    fontWeight: "600",
  },
  noteSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.glassLight,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: spacing.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  noteText: {
    fontSize: typography.caption1,
    color: colors.warning,
    flex: 1,
    lineHeight: 20,
  },
});
