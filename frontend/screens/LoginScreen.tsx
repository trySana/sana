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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  GradientBackground,
  Button,
  Input,
  FadeInView,
} from "../components/common";
import { SanaLogo } from "../components/icons/SanaLogo";
import {
  colors,
  typography,
  spacing,
  dimensions,
  shadows,
  borderRadius,
} from "../constants/theme";

interface LoginScreenProps {
  onLoginSuccess?: () => void;
  onNavigateToSignUp?: () => void;
  onForgotPassword?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToSignUp,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState("thibaud.combaz@gmail.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <GradientBackground variant="main" style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={Platform.OS === "android"}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Container - Perfectly Centered */}
          <View style={styles.mainContainer}>
            {/* Logo Section */}
            <FadeInView delay={100} style={styles.logoSection}>
              <SanaLogo size={56} />
            </FadeInView>

            {/* Welcome Text */}
            <FadeInView delay={200} style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Welcome back</Text>
              <Text style={styles.welcomeSubtitle}>
                Sign in to your account
              </Text>
            </FadeInView>

            {/* Login Form */}
            <FadeInView delay={300} style={styles.formContainer}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Input
                  label=""
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon="mail-outline"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Input
                  label=""
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  leftIcon="lock-closed-outline"
                />
              </View>

              {/* Remember Me & Forgot Password */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxChecked,
                    ]}
                  >
                    {rememberMe && (
                      <Ionicons
                        name="checkmark"
                        size={12}
                        color={colors.white}
                      />
                    )}
                  </View>
                  <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onForgotPassword}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              {/* Sign In Button */}
              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={isLoading}
                style={styles.signInButton}
              />

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Buttons */}
              <View style={styles.socialContainer}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialLogin("Google")}
                >
                  <Text style={styles.googleIcon}>G</Text>
                  <Text style={styles.socialButtonText}>
                    Continue with Google
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleSocialLogin("Apple")}
                >
                  <Ionicons
                    name="logo-apple"
                    size={20}
                    color={colors.textPrimary}
                  />
                  <Text style={styles.socialButtonText}>
                    Continue with Apple
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Sign Up Link */}
              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={onNavigateToSignUp}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </FadeInView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Home Indicator */}
      {Platform.OS === "ios" && <View style={styles.homeIndicator} />}
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center", // Centrage vertical parfait
    paddingHorizontal: 32,
    paddingVertical: 40,
  },

  // Main Container - Centré
  mainContainer: {
    width: "100%",
    maxWidth: 400, // Largeur maximale moderne
    alignSelf: "center", // Centrage horizontal parfait
  },

  // Logo Section
  logoSection: {
    alignItems: "center",
    marginBottom: 32,
  },

  // Welcome Section
  welcomeSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textSecondary,
    textAlign: "center",
  },

  // Form Container
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },

  // Options Row - Remember Me & Forgot Password
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20, // Plus grand pour meilleure visibilité
    height: 20,
    borderRadius: 4,
    borderWidth: 2, // Bordure plus épaisse
    borderColor: colors.textSecondary, // Couleur plus visible
    backgroundColor: colors.white,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary, // Fond coloré quand coché
    borderColor: colors.primary,
  },
  rememberText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary, // Couleur plus foncée pour visibilité
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },

  // Sign In Button
  signInButton: {
    width: "100%",
    marginBottom: 32,
    height: 56, // Bouton plus haut pour meilleure accessibilité
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

  // Social Buttons
  socialContainer: {
    gap: 16, // Espacement moderne
    marginBottom: 32,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5, // Bordure plus visible
    borderColor: "rgba(0, 0, 0, 0.08)",
    backgroundColor: colors.white,
    gap: 12, // Espacement entre icône et texte
    ...shadows.xs, // Ombre légère
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4285F4", // Couleur officielle Google
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  // Sign Up Link
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  signUpLink: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
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
