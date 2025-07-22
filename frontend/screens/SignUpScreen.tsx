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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryModal, setShowCountryModal] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onSignUpSuccess) {
        onSignUpSuccess();
      }
    }, 1500);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
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

  const handleSocialSignUp = (provider: string) => {
    console.log(`Sign up with ${provider}`);
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
      {/* Name Fields */}
      <View style={styles.nameContainer}>
        <View style={styles.nameInputHalf}>
          <Input
            label=""
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First name"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.nameInputHalf}>
          <Input
            label=""
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last name"
            autoCapitalize="words"
          />
        </View>
      </View>

      {/* Phone with Country Picker */}
      <View style={styles.phoneContainer}>
        <TouchableOpacity
          style={styles.countryButton}
          onPress={() => setShowCountryModal(true)}
        >
          <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
          <Text style={styles.countryCode}>{selectedCountry.dialCode}</Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <View style={styles.phoneInputContainer}>
          <Input
            label=""
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            keyboardType="phone-pad"
          />
        </View>
      </View>
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
});
