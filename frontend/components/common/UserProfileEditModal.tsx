import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ValidatedInput, Button, ProfileImagePicker } from "./index";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import { useFormValidation } from "../../utils/validation";
import { ApiService } from "../../services/api";

interface UserProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface FormData {
  username: string;
  email: string;
  phone_number: string;
  bio: string;
  sex: string;
  date_of_birth: string;
  profile_image: string;
}

export const UserProfileEditModal: React.FC<UserProfileEditModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    phone_number: "",
    bio: "",
    sex: "",
    date_of_birth: "",
    profile_image: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Validation du formulaire principal
  const {
    errors: profileErrors,
    touched: profileTouched,
    handleFieldChange: handleProfileFieldChange,
    handleFieldBlur: handleProfileBlur,
    validateForm: validateProfileForm,
    clearErrors: clearProfileErrors,
  } = useFormValidation({
    username: { required: true, minLength: 3, maxLength: 20 },
    email: { required: true, email: true },
    phone_number: { required: false, minLength: 10, maxLength: 15 },
    bio: { required: false, maxLength: 500 },
    sex: { required: false },
    date_of_birth: { required: false },
  });

  // Validation du formulaire de mot de passe
  const {
    errors: passwordErrors,
    touched: passwordTouched,
    handleFieldChange: handlePasswordFieldChange,
    handleFieldBlur: handlePasswordBlur,
    validateForm: validatePasswordForm,
    clearErrors: clearPasswordErrors,
  } = useFormValidation({
    current_password: { required: true, minLength: 1 },
    new_password: { required: true, minLength: 8 },
    confirm_password: { required: true, minLength: 1 },
  });

  useEffect(() => {
    if (visible && user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        bio: user.bio || "",
        sex: user.sex || "",
        date_of_birth: user.date_of_birth || "",
        profile_image: user.profile_image || "",
      });
      clearProfileErrors();
      clearPasswordErrors();
    }
  }, [visible, user]);

  const handleSaveProfile = async () => {
    const result = validateProfileForm(formData);
    if (!result.isValid) {
      Alert.alert("Erreur de validation", "Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    try {
      setIsLoading(true);
      await updateProfile(formData);
      Alert.alert("Succès", "Profil mis à jour avec succès !");
      onSave();
    } catch (error: any) {
      Alert.alert("Erreur", error.userMessage || "Impossible de mettre à jour le profil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const result = validatePasswordForm(passwordData);
    if (!result.isValid) {
      Alert.alert("Erreur de validation", "Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      Alert.alert("Erreur", "Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    try {
      setIsLoading(true);
      
      // Appel API pour changer le mot de passe
      await ApiService.changePassword(
        user?.username || "",
        passwordData.current_password,
        passwordData.new_password,
        passwordData.confirm_password
      );

      Alert.alert("Succès", "Mot de passe changé avec succès !");
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
      setShowPasswordSection(false);
    } catch (error: any) {
      Alert.alert("Erreur", error.userMessage || "Impossible de changer le mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (fieldName: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    handleProfileFieldChange(fieldName, value);
  };

  const updatePasswordField = (fieldName: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [fieldName]: value }));
    handlePasswordFieldChange(fieldName, value);
  };

  const getSexOptions = () => [
    { label: "Homme", value: "MALE" },
    { label: "Femme", value: "FEMALE" },
    { label: "Autre", value: "OTHER" },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Modifier le profil</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Photo de profil */}
          <View style={styles.profilePhotoSection}>
            <ProfileImagePicker
              currentImage={formData.profile_image}
              onImageSelected={(imageUri) => updateField("profile_image", imageUri)}
              size={120}
              showChangeButton={true}
            />
          </View>

          {/* Informations de base */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations de base</Text>
            
            <ValidatedInput
              label="Nom d'utilisateur"
              value={formData.username}
              onChangeText={(text) => updateField("username", text)}
              onBlur={() => handleProfileBlur("username", formData.username)}
              error={profileTouched.username ? profileErrors.username : undefined}
              leftIcon="person-outline"
              placeholder="Votre nom d'utilisateur"
              autoCapitalize="none"
            />

            <ValidatedInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => updateField("email", text)}
              onBlur={() => handleProfileBlur("email", formData.email)}
              error={profileTouched.email ? profileErrors.email : undefined}
              leftIcon="mail-outline"
              placeholder="votre@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <ValidatedInput
              label="Numéro de téléphone"
              value={formData.phone_number}
              onChangeText={(text) => updateField("phone_number", text)}
              onBlur={() => handleProfileBlur("phone_number", formData.phone_number)}
              error={profileTouched.phone_number ? profileErrors.phone_number : undefined}
              leftIcon="call-outline"
              placeholder="+33 6 12 34 56 78"
              keyboardType="phone-pad"
            />

            <ValidatedInput
              label="Sexe"
              value={formData.sex}
              onChangeText={(text) => updateField("sex", text)}
              onBlur={() => handleProfileBlur("sex", formData.sex)}
              error={profileTouched.sex ? profileErrors.sex : undefined}
              leftIcon="body-outline"
              placeholder="Homme, Femme, Autre"
            />

            <ValidatedInput
              label="Date de naissance"
              value={formData.date_of_birth}
              onChangeText={(text) => updateField("date_of_birth", text)}
              onBlur={() => handleProfileBlur("date_of_birth", formData.date_of_birth)}
              error={profileTouched.date_of_birth ? profileErrors.date_of_birth : undefined}
              leftIcon="calendar-outline"
              placeholder="JJ/MM/AAAA"
            />
          </View>

          {/* Bio */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>À propos de vous</Text>
            
            <ValidatedInput
              label="Bio"
              value={formData.bio}
              onChangeText={(text) => updateField("bio", text)}
              onBlur={() => handleProfileBlur("bio", formData.bio)}
              error={profileTouched.bio ? profileErrors.bio : undefined}
              leftIcon="chatbubble-outline"
              placeholder="Parlez-nous de vous..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={styles.bioInput}
            />
          </View>

          {/* Section mot de passe */}
          <View style={styles.section}>
            <View style={styles.passwordHeader}>
              <Text style={styles.sectionTitle}>Sécurité</Text>
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPasswordSection(!showPasswordSection)}
              >
                <Text style={styles.passwordToggleText}>
                  {showPasswordSection ? "Masquer" : "Changer le mot de passe"}
                </Text>
                <Ionicons
                  name={showPasswordSection ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>

            {showPasswordSection && (
              <View style={styles.passwordSection}>
                <ValidatedInput
                  label="Mot de passe actuel"
                  value={passwordData.current_password}
                  onChangeText={(text) => updatePasswordField("current_password", text)}
                  onBlur={() => handlePasswordBlur("current_password", passwordData.current_password)}
                  error={passwordTouched.current_password ? passwordErrors.current_password : undefined}
                  leftIcon="lock-closed-outline"
                  placeholder="Votre mot de passe actuel"
                  secureTextEntry
                />

                <ValidatedInput
                  label="Nouveau mot de passe"
                  value={passwordData.new_password}
                  onChangeText={(text) => updatePasswordField("new_password", text)}
                  onBlur={() => handlePasswordBlur("new_password", passwordData.new_password)}
                  error={passwordTouched.new_password ? passwordErrors.new_password : undefined}
                  leftIcon="lock-open-outline"
                  placeholder="Nouveau mot de passe (min 8 caractères)"
                  secureTextEntry
                />

                <ValidatedInput
                  label="Confirmer le nouveau mot de passe"
                  value={passwordData.confirm_password}
                  onChangeText={(text) => updatePasswordField("confirm_password", text)}
                  onBlur={() => handlePasswordBlur("confirm_password", passwordData.confirm_password)}
                  error={passwordTouched.confirm_password ? passwordErrors.confirm_password : undefined}
                  leftIcon="checkmark-circle-outline"
                  placeholder="Confirmez le nouveau mot de passe"
                  secureTextEntry
                />

                <Button
                  title="Changer le mot de passe"
                  onPress={handleChangePassword}
                  style={styles.passwordButton}
                  loading={isLoading}
                  disabled={isLoading}
                />
              </View>
            )}
          </View>
        </ScrollView>

        {/* Boutons d'action */}
        <View style={styles.actionsContainer}>
          <Button
            title="Sauvegarder le profil"
            onPress={handleSaveProfile}
            style={styles.saveButton}
            loading={isLoading}
            disabled={isLoading}
          />
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: Platform.OS === "ios" ? 50 : spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
    backgroundColor: colors.white,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cardBackground,
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
  content: {
    flex: 1,
  },
  profilePhotoSection: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.title3,
    fontWeight: typography.weights.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  bioInput: {
    minHeight: 100,
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  passwordToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  passwordToggleText: {
    fontSize: typography.footnote,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  passwordSection: {
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.separator,
  },
  passwordButton: {
    backgroundColor: colors.warning,
    marginTop: spacing.sm,
  },
  actionsContainer: {
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
}); 