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
    // Simulation d'une connexion
    setTimeout(() => {
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // TODO: Implémenter la connexion sociale
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
          <FadeInView delay={200} style={styles.cardContainer}>
            <View style={styles.card}>
              {/* Logo */}
              <View style={styles.logoContainer}>
                <SanaLogo size={80} />
              </View>

              {/* Titre et description */}
              <View style={styles.headerContainer}>
                <Text style={styles.title}>Login</Text>
                <Text style={styles.description}>
                  Enter your email and password to log in
                </Text>
              </View>

              {/* Formulaire */}
              <View style={styles.formContainer}>
                <Input
                  label=""
                  value={email}
                  onChangeText={setEmail}
                  placeholder="thibaud.combaz@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon="mail-outline"
                  containerStyle={styles.inputContainer}
                />

                <Input
                  label=""
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  leftIcon="lock-closed-outline"
                  containerStyle={styles.inputContainer}
                />

                {/* Remember me + Forgot password */}
                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={styles.rememberMeContainer}
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
                    <Text style={styles.rememberMeText}>Remember me</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={onForgotPassword}>
                    <Text style={styles.forgotPasswordText}>
                      Forgot Password ?
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Bouton de connexion */}
                <Button
                  title="Log In"
                  onPress={handleLogin}
                  loading={isLoading}
                  style={styles.loginButton}
                />

                {/* Séparateur */}
                <View style={styles.separatorContainer}>
                  <View style={styles.separatorLine} />
                  <Text style={styles.separatorText}>Or login with</Text>
                  <View style={styles.separatorLine} />
                </View>

                {/* Boutons sociaux */}
                <View style={styles.socialContainer}>
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleSocialLogin("google")}
                  >
                    <Text
                      style={[styles.socialButtonText, { color: "#4285F4" }]}
                    >
                      G
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleSocialLogin("facebook")}
                  >
                    <Text
                      style={[styles.socialButtonText, { color: "#1877F2" }]}
                    >
                      f
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleSocialLogin("apple")}
                  >
                    <Ionicons name="logo-apple" size={20} color="#000000" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => handleSocialLogin("phone")}
                  >
                    <Ionicons
                      name="call-outline"
                      size={20}
                      color={colors.textPrimary}
                    />
                  </TouchableOpacity>
                </View>

                {/* Lien vers Sign Up */}
                <View style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={onNavigateToSignUp}>
                    <Text style={styles.signUpLink}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </FadeInView>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Mobile home indicator */}
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
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === "ios" ? dimensions.safeAreaTop + 20 : 40,
    paddingBottom: Platform.OS === "ios" ? dimensions.safeAreaBottom + 20 : 40,
  },
  cardContainer: {
    alignItems: "center",
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.card,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    width: "100%",
    maxWidth: 380,
    ...shadows.lg,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.title1,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  description: {
    fontSize: typography.body,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: typography.body * 1.4,
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.separator,
    marginRight: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rememberMeText: {
    fontSize: typography.footnote,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
  },
  forgotPasswordText: {
    fontSize: typography.footnote,
    fontWeight: typography.weights.medium,
    color: colors.primary,
  },
  loginButton: {
    marginBottom: spacing.xl,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.separator,
  },
  separatorText: {
    fontSize: typography.footnote,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.separator,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },
  socialButtonText: {
    fontSize: typography.title3,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    fontSize: typography.footnote,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
  },
  signUpLink: {
    fontSize: typography.footnote,
    fontWeight: typography.weights.semiBold,
    color: colors.primary,
  },
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
