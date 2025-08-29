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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  GradientBackground,
  FadeInView,
  ValidatedInput,
  Button,
  ProfileImagePicker,
} from "../components/common";
import {
  colors,
  typography,
  spacing,
  dimensions,
  shadows,
  borderRadius,
} from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { useFormValidation, FORM_VALIDATION_RULES } from "../utils/validation";

interface EditProfileScreenProps {
  onBack?: () => void;
  onSave?: () => void;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  onBack,
  onSave,
}) => {
  const { user, updateProfile } = useAuth();

  // État du formulaire
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    username: user?.username || "",
    email: user?.email || "",
    phoneNumber: "",
    bio: "",
    sex: user?.sex || "",
    date_of_birth: user?.date_of_birth || "",
  });

  // Validation du formulaire
  const {
    errors,
    touched,
    handleFieldChange,
    handleFieldBlur,
    validateForm,
    clearErrors,
  } = useFormValidation({
    username: { required: true, minLength: 3, maxLength: 20 },
    email: { required: true, email: true },
    phoneNumber: { required: false },
    bio: { required: false, maxLength: 500 },
    sex: { required: false },
    date_of_birth: { required: false },
  });

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleSave = async () => {
    // Valider le formulaire
    const result = validateForm(formData);

    if (!result.isValid) {
      Alert.alert(
        "Erreur de validation",
        "Veuillez corriger les erreurs dans le formulaire",
      );
      return;
    }

    try {
      // Mettre à jour le profil via l'API
      await updateProfile(formData);

      Alert.alert(
        "Profil mis à jour",
        "Votre profil a été mis à jour avec succès !",
        [
          {
            text: "OK",
            onPress: () => {
              if (onSave) onSave();
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour le profil");
      console.error("Erreur mise à jour profil:", error);
    }
  };

  const updateField = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    handleFieldChange(fieldName, value);
  };

  const onFieldBlur = (fieldName: string) => {
    handleFieldBlur(fieldName, formData[fieldName]);
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
        <Text style={styles.headerTitle}>Modifier le profil</Text>
        <View style={styles.headerSpacer} />
      </FadeInView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo de profil */}
        <FadeInView delay={200} style={styles.profilePhotoSection}>
          <ProfileImagePicker
            currentImage={undefined}
            onImageSelected={(imageUri) => {
              console.log("Nouvelle image sélectionnée:", imageUri);
              // Mettre à jour le champ profile_image dans le formulaire
              updateField("profile_image", imageUri);
            }}
            size={120}
            showChangeButton={true}
          />
        </FadeInView>

        {/* Formulaire */}
        <FadeInView delay={300} style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>

          <ValidatedInput
            label="Nom d'utilisateur"
            value={formData.username}
            onChangeText={(text) => updateField("username", text)}
            onBlur={() => onFieldBlur("username")}
            error={touched.username ? errors.username : undefined}
            leftIcon="person-outline"
            placeholder="Votre nom d'utilisateur"
            autoCapitalize="none"
          />

          <ValidatedInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => updateField("email", text)}
            onBlur={() => onFieldBlur("email")}
            error={touched.email ? errors.email : undefined}
            leftIcon="mail-outline"
            placeholder="votre@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <ValidatedInput
            label="Numéro de téléphone"
            value={formData.phoneNumber}
            onChangeText={(text) => updateField("phoneNumber", text)}
            onBlur={() => onFieldBlur("phoneNumber")}
            error={touched.phoneNumber ? errors.phoneNumber : undefined}
            leftIcon="call-outline"
            placeholder="+33 6 12 34 56 78"
            keyboardType="phone-pad"
          />

          <ValidatedInput
            label="Bio"
            value={formData.bio}
            onChangeText={(text) => updateField("bio", text)}
            onBlur={() => onFieldBlur("bio")}
            error={touched.bio ? errors.bio : undefined}
            leftIcon="chatbubble-outline"
            placeholder="Parlez-nous de vous..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={styles.bioInput}
          />

          <ValidatedInput
            label="Sexe"
            value={formData.sex}
            onChangeText={(text) => updateField("sex", text)}
            onBlur={() => onFieldBlur("sex")}
            error={touched.sex ? errors.sex : undefined}
            leftIcon="body-outline"
            placeholder="Homme, Femme, Autre"
          />

          <ValidatedInput
            label="Date de naissance"
            value={formData.date_of_birth}
            onChangeText={(text) => updateField("date_of_birth", text)}
            onBlur={() => onFieldBlur("date_of_birth")}
            error={touched.date_of_birth ? errors.date_of_birth : undefined}
            leftIcon="calendar-outline"
            placeholder="JJ/MM/AAAA"
          />
        </FadeInView>

        {/* Boutons d'action */}
        <FadeInView delay={400} style={styles.actionsSection}>
          <Button
            title="Sauvegarder"
            onPress={handleSave}
            style={styles.saveButton}
          />

          <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
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
  profilePhotoSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  formSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.title3,
    fontWeight: typography.weights.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  bioInput: {
    minHeight: 80,
  },
  actionsSection: {
    gap: spacing.md,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
});
