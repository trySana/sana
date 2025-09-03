import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import {
  GradientBackground,
  Button,
  Input,
  FadeInView,
} from "../components/common";
import {
  colors,
  typography,
  spacing,
  dimensions,
  shadows,
  borderRadius,
} from "../constants/theme";
import GoogleAuthService from "../services/googleAuth";

interface SignUpScreenProps {
  onSignUpSuccess?: () => void;
  onNavigateToLogin?: () => void;
  onBack?: () => void;
}

const countries = [
  { code: "CH", flag: "��🇭", dialCode: "+41", name: "Switzerland" },
  { code: "FR", flag: "🇫🇷", dialCode: "+33", name: "France" },
  { code: "US", flag: "🇺🇸", dialCode: "+1", name: "United States" },
  { code: "GB", flag: "🇬🇧", dialCode: "+44", name: "United Kingdom" },
  { code: "DE", flag: "🇩🇪", dialCode: "+49", name: "Germany" },
  { code: "ES", flag: "🇪🇸", dialCode: "+34", name: "Spain" },
];

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSignUpSuccess,
  onNavigateToLogin,
  onBack,
}) => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Form data
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [sex, setSex] = useState("MALE");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryModal, setShowCountryModal] = useState(false);

  const { signup, error, clearError } = useAuth();

  const handleSignUp = async () => {
    console.log("handleSignUp called with data:", {
      username,
      email,
      password: password ? "***" : "undefined",
      sex,
      dateOfBirth,
      confirmPassword: confirmPassword ? "***" : "undefined",
    });

    if (!username || !email || !password || !sex || !dateOfBirth) {
      console.log("Missing fields:", {
        username: !!username,
        email: !!email,
        password: !!password,
        sex: !!sex,
        dateOfBirth: !!dateOfBirth,
      });
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      console.log("Password mismatch");
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }

    console.log("All validations passed, calling API...");
    try {

      console.log("Sending data to API:", {
        username,
        email,
        password: "***",
        sex,
        date_of_birth: dateOfBirth,
      });

      await signup({
        username,
        email,
        password,
        sex,
        date_of_birth: dateOfBirth,
      });

      console.log("Signup successful!");
      if (onSignUpSuccess) {
        onSignUpSuccess();
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const handleNext = () => {
    console.log(`Current step: ${currentStep}, Total steps: ${totalSteps}`);
    if (currentStep < totalSteps) {
      console.log(`Moving to next step: ${currentStep + 1}`);
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Final step reached, calling handleSignUp");
      handleSignUp();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const handleCountrySelect = (country: (typeof countries)[0]) => {
    setSelectedCountry(country);
    setShowCountryModal(false);
  };

  const handleSocialSignUp = async (provider: string) => {
    try {
      if (provider === "Google") {
        const googleAuth = GoogleAuthService.getInstance();
        const result = await googleAuth.signIn();

        if (result.success && result.user) {
          // Pré-remplir le formulaire avec les données Google
          setEmail(result.user.email);
          setUsername(result.user.email.split("@")[0]); // Utiliser la partie avant @ comme username

          // Si l'utilisateur a un prénom et nom, les utiliser
          if (result.user.givenName && result.user.familyName) {
            // On pourrait ajouter des champs pour le prénom et nom si nécessaire
          }

          // Passer à l'étape suivante
          if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
          }

          Alert.alert(
            "Succès",
            `Connecté avec Google en tant que ${result.user.name}`,
          );
        } else {
          Alert.alert("Erreur", result.error || "Échec de la connexion Google");
        }
      } else {
        console.log(`Sign up with ${provider} not implemented yet`);
        Alert.alert(
          "Info",
          `Inscription avec ${provider} pas encore implémentée`,
        );
      }
    } catch (error) {
      console.error("Social sign up failed:", error);
      Alert.alert("Erreur", "Impossible de s'inscrire avec Google.");
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View
          key={index}
          style={[
            styles.progressStep,
            index + 1 <= currentStep && styles.progressStepActive,
          ]}
        />
      ))}
    </View>
  );

  const renderStep1 = () => (
    <>
      {/* Social Sign Up Options */}
      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => handleSocialSignUp("Google")}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => handleSocialSignUp("Apple")}
        >
          <Ionicons name="logo-apple" size={20} color={colors.textPrimary} />
          <Text style={styles.socialButtonText}>Continue with Apple</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or sign up with email</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Input
          label=""
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email address"
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="mail-outline"
        />
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      {/* Username Field */}
      <View style={styles.inputContainer}>
        <Input
          label=""
          value={username}
          onChangeText={setUsername}
          placeholder="Username (5-15 characters)"
          autoCapitalize="none"
          leftIcon="person-outline"
        />
      </View>

      {/* Sex Selection */}
      <View style={styles.inputContainer}>
        <View style={styles.sexContainer}>
          <TouchableOpacity
            style={[styles.sexButton, sex === "MALE" && styles.sexButtonActive]}
            onPress={() => setSex("MALE")}
          >
            <Text
              style={[
                styles.sexButtonText,
                sex === "MALE" && styles.sexButtonTextActive,
              ]}
            >
              Male
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sexButton,
              sex === "FEMALE" && styles.sexButtonActive,
            ]}
            onPress={() => setSex("FEMALE")}
          >
            <Text
              style={[
                styles.sexButtonText,
                sex === "FEMALE" && styles.sexButtonTextActive,
              ]}
            >
              Female
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date of Birth */}
      <View style={styles.inputContainer}>
        <Input
          label=""
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="Date of birth (YYYY-MM-DD)"
          leftIcon="calendar-outline"
        />
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={clearError}
            style={styles.clearErrorButton}
          >
            <Ionicons name="close-circle" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  const renderStep3 = () => (
    <>
      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Input
          label=""
          value={password}
          onChangeText={setPassword}
          placeholder="Create password"
          secureTextEntry={!showPassword}
          rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
          onRightIconPress={() => setShowPassword(!showPassword)}
          leftIcon="lock-closed-outline"
        />
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <Input
          label=""
          value={confirmPassword}
          onChangeText={(text) => {
            console.log("confirmPassword onChangeText:", text);
            setConfirmPassword(text);
          }}
          placeholder="Confirm password"
          secureTextEntry={!showConfirmPassword}
          rightIcon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
          onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          leftIcon="lock-closed-outline"
        />

        {/* Password Match Indicator */}
        {confirmPassword && (
          <View style={styles.passwordMatchContainer}>
            <Ionicons
              name={
                password === confirmPassword
                  ? "checkmark-circle"
                  : "close-circle"
              }
              size={16}
              color={
                password === confirmPassword ? colors.success : colors.error
              }
            />
            <Text
              style={[
                styles.passwordMatchText,
                {
                  color:
                    password === confirmPassword
                      ? colors.success
                      : colors.error,
                },
              ]}
            >
              {password === confirmPassword
                ? "Passwords match"
                : "Passwords don't match"}
            </Text>
          </View>
        )}

        {/* Debug Info */}
        <Text style={{ fontSize: 10, color: "red" }}>
          Debug: confirmPassword = "{confirmPassword}" (length:{" "}
          {confirmPassword?.length || 0})
        </Text>
      </View>

      {/* Password Requirements */}
      <View style={styles.passwordRequirements}>
        <Text style={styles.requirementsTitle}>Password must contain:</Text>
        <View style={styles.requirement}>
          <Ionicons
            name={password.length >= 8 ? "checkmark-circle" : "ellipse-outline"}
            size={16}
            color={password.length >= 8 ? "#4CAF50" : colors.textSecondary}
          />
          <Text
            style={[
              styles.requirementText,
              password.length >= 8 && styles.requirementMet,
            ]}
          >
            At least 8 characters
          </Text>
        </View>
        <View style={styles.requirement}>
          <Ionicons
            name={
              /[A-Z]/.test(password) ? "checkmark-circle" : "ellipse-outline"
            }
            size={16}
            color={/[A-Z]/.test(password) ? "#4CAF50" : colors.textSecondary}
          />
          <Text
            style={[
              styles.requirementText,
              /[A-Z]/.test(password) && styles.requirementMet,
            ]}
          >
            One uppercase letter
          </Text>
        </View>
        <View style={styles.requirement}>
          <Ionicons
            name={/\d/.test(password) ? "checkmark-circle" : "ellipse-outline"}
            size={16}
            color={/\d/.test(password) ? "#4CAF50" : colors.textSecondary}
          />
          <Text
            style={[
              styles.requirementText,
              /\d/.test(password) && styles.requirementMet,
            ]}
          >
            One number
          </Text>
        </View>
      </View>
    </>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Let's get started";
      case 2:
        return "Tell us about yourself";
      case 3:
        return "Secure your account";
      default:
        return "";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return "Choose how you'd like to sign up";
      case 2:
        return "We'll need some basic information";
      case 3:
        return "Create a strong password";
      default:
        return "";
    }
  };

  const getButtonTitle = () => {
    switch (currentStep) {
      case 1:
        return "Continue";
      case 2:
        return "Next";
      case 3:
        return "Create Account";
      default:
        return "Next";
    }
  };

  return (
    <GradientBackground variant="main" style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={Platform.OS === "android"}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign Up</Text>
      </View>

      {/* Progress Bar */}
      {renderProgressBar()}

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Container */}
          <View style={styles.mainContainer}>
            {/* Step Title */}
            <FadeInView delay={100} style={styles.titleContainer}>
              <Text style={styles.stepTitle}>{getStepTitle()}</Text>
              <Text style={styles.stepSubtitle}>{getStepSubtitle()}</Text>
            </FadeInView>

            {/* Step Content */}
            <FadeInView delay={200} style={styles.formContainer}>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </FadeInView>

            {/* Continue Button */}
            <FadeInView delay={300}>
              <Button
                title={getButtonTitle()}
                onPress={handleNext}
                loading={isLoading}
                style={styles.continueButton}
              />
            </FadeInView>

            {/* Login Link - Only show on first step */}
            {currentStep === 1 && (
              <FadeInView delay={400} style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={onNavigateToLogin}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </FadeInView>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Modal */}
      <Modal
        visible={showCountryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setShowCountryModal(false)}
              >
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.countryList}>
              {countries.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={styles.countryItem}
                  onPress={() => handleCountrySelect(country)}
                >
                  <Text style={styles.countryFlag}>{country.flag}</Text>
                  <Text style={styles.countryName}>{country.name}</Text>
                  <Text style={styles.countryDialCode}>{country.dialCode}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Home Indicator */}
      {Platform.OS === "ios" && <View style={styles.homeIndicator} />}
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    paddingTop: Platform.OS === "ios" ? dimensions.safeAreaTop + 16 : 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  // Progress Bar
  progressContainer: {
    flexDirection: "row",
    paddingHorizontal: 32,
    marginBottom: 32,
    gap: 8,
  },
  progressStep: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
  progressStepActive: {
    backgroundColor: colors.primary,
  },

  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingBottom: 40,
  },

  // Main Container
  mainContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },

  // Title Section
  titleContainer: {
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  stepSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },

  // Form Container
  formContainer: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },

  // Social Buttons
  socialContainer: {
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(0, 0, 0, 0.08)",
    backgroundColor: colors.white,
    gap: 12,
    ...shadows.xs,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4285F4",
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
  dividerText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    marginHorizontal: 20,
  },

  // Name Fields
  nameContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  nameInputHalf: {
    flex: 1,
  },

  // Phone Fields
  phoneContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  countryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    backgroundColor: colors.white,
    gap: 8,
    minWidth: 100,
  },
  countryFlag: {
    fontSize: 20,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  phoneInputContainer: {
    flex: 1,
  },

  // Password Requirements
  passwordRequirements: {
    marginTop: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  requirement: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  requirementText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  requirementMet: {
    color: "#4CAF50",
  },

  // Continue Button
  continueButton: {
    width: "100%",
    height: 56,
    marginBottom: 32,
  },

  // Login Link
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
  },

  // Country Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.06)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.04)",
    gap: 16,
  },
  countryName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
    flex: 1,
  },
  countryDialCode: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },

  // Home Indicator
  homeIndicator: {
    position: "absolute",
    bottom: 8,
    left: "50%",
    marginLeft: -67,
    width: 134,
    height: 5,
    backgroundColor: "#000000",
    borderRadius: 2.5,
  },

  // Sex Selection Styles
  sexContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  sexButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.separator,
    alignItems: "center",
    justifyContent: "center",
  },
  sexButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "20",
  },
  sexButtonText: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  sexButtonTextActive: {
    color: colors.primary,
  },

  // Error styles
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.error + "20",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  errorText: {
    flex: 1,
    color: colors.error,
    fontSize: typography.footnote,
    fontFamily: "System",
  },
  clearErrorButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },

  // Password Match Indicator
  passwordMatchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  passwordMatchText: {
    fontSize: typography.footnote,
    fontFamily: "System",
  },
});
