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
// Removed DateTimePicker dependency - using custom date selector
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
  { code: "CH", flag: "🇨🇭", dialCode: "+41" },
  { code: "FR", flag: "🇫🇷", dialCode: "+33" },
  { code: "US", flag: "🇺🇸", dialCode: "+1" },
  { code: "GB", flag: "🇬🇧", dialCode: "+44" },
  { code: "DE", flag: "🇩🇪", dialCode: "+49" },
  { code: "ES", flag: "🇪🇸", dialCode: "+34" },
];

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSignUpSuccess,
  onNavigateToLogin,
  onBack,
}) => {
  const [firstName, setFirstName] = useState("Gibril");
  const [lastName, setLastName] = useState("Gil");
  const [email, setEmail] = useState("thibaud.combaz@gmail.com");
  const [dateOfBirth, setDateOfBirth] = useState("30/02/2004");
  const [phone, setPhone] = useState("78 901 23 45");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);
    // Simulation d'une inscription
    setTimeout(() => {
      setIsLoading(false);
      if (onSignUpSuccess) {
        onSignUpSuccess();
      }
    }, 1500);
  };

  const handleDatePress = () => {
    setShowDatePicker(true);
  };

  const handleDatePickerClose = () => {
    setShowDatePicker(false);
  };

  const handleCountrySelect = (country: (typeof countries)[0]) => {
    setSelectedCountry(country);
    setShowCountryModal(false);
  };

  return (
    <GradientBackground variant="main" style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={Platform.OS === "android"}
      />

      {/* Bouton retour */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

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
              {/* Titre et description */}
              <View style={styles.headerContainer}>
                <Text style={styles.title}>Sign Up</Text>
                <Text style={styles.description}>
                  Create an account to continue!
                </Text>
              </View>

              {/* Formulaire */}
              <View style={styles.formContainer}>
                {/* Prénom */}
                <Input
                  label=""
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Gibril"
                  autoCapitalize="words"
                  containerStyle={styles.inputContainer}
                />

                {/* Nom */}
                <Input
                  label=""
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Gil"
                  autoCapitalize="words"
                  containerStyle={styles.inputContainer}
                />

                {/* Email */}
                <Input
                  label=""
                  value={email}
                  onChangeText={setEmail}
                  placeholder="thibaud.combaz@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  containerStyle={styles.inputContainer}
                />

                {/* Date de naissance */}
                <Input
                  label=""
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  placeholder="30/02/2004"
                  rightIcon="calendar-outline"
                  onRightIconPress={handleDatePress}
                  containerStyle={styles.inputContainer}
                />

                {/* Téléphone avec sélecteur de pays */}
                <View style={styles.phoneContainer}>
                  <TouchableOpacity
                    style={styles.countrySelector}
                    onPress={() => setShowCountryModal(true)}
                  >
                    <Text style={styles.countryFlag}>
                      {selectedCountry.flag}
                    </Text>
                    <Ionicons
                      name="chevron-down"
                      size={14}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>

                  <Input
                    label=""
                    value={`${selectedCountry.dialCode} ${phone}`}
                    onChangeText={(text) => {
                      // Extraire le numéro en retirant le code pays
                      const phoneNumber = text
                        .replace(selectedCountry.dialCode, "")
                        .trim();
                      setPhone(phoneNumber);
                    }}
                    placeholder={`${selectedCountry.dialCode} 78 901 23 45`}
                    keyboardType="phone-pad"
                    containerStyle={styles.phoneInputContainer}
                  />
                </View>

                {/* Mot de passe */}
                <Input
                  label=""
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                  containerStyle={styles.inputContainer}
                />

                {/* Bouton d'inscription */}
                <Button
                  title="Register"
                  onPress={handleSignUp}
                  loading={isLoading}
                  style={styles.registerButton}
                />

                {/* Lien vers Login */}
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>
                    Already have an account?{" "}
                  </Text>
                  <TouchableOpacity onPress={onNavigateToLogin}>
                    <Text style={styles.loginLink}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </FadeInView>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de sélection de pays */}
      <Modal
        visible={showCountryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {countries.map((country, index) => (
              <TouchableOpacity
                key={country.code}
                style={styles.countryOption}
                onPress={() => handleCountrySelect(country)}
              >
                <Text style={styles.countryOptionFlag}>{country.flag}</Text>
                <Text style={styles.countryOptionText}>
                  {country.code} {country.dialCode}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Modal de sélection de date personnalisé */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={handleDatePickerClose}
      >
        <View style={styles.datePickerModalOverlay}>
          <View style={styles.datePickerModalContent}>
            <View style={styles.datePickerHeader}>
              <Text style={styles.datePickerTitle}>Select Date of Birth</Text>
              <TouchableOpacity onPress={handleDatePickerClose}>
                <Text style={styles.datePickerDone}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateInputContainer}>
              <Input
                label=""
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                placeholder="30/02/2004"
                keyboardType="numeric"
                autoFocus={true}
                containerStyle={styles.dateInput}
              />
              <Text style={styles.dateHint}>
                Please enter your date of birth in DD/MM/YYYY format
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Mobile home indicator */}
      {Platform.OS === "ios" && <View style={styles.homeIndicator} />}
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? dimensions.safeAreaTop + 10 : 40,
    left: spacing.lg,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === "ios" ? dimensions.safeAreaTop + 60 : 80,
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
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.separator,
    borderRadius: borderRadius.input,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    height: dimensions.inputHeight,
    minWidth: 60,
    ...shadows.xs,
  },
  countryFlag: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  phoneInputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  registerButton: {
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: typography.footnote,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: typography.footnote,
    fontWeight: typography.weights.semiBold,
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    paddingBottom: Platform.OS === "ios" ? dimensions.safeAreaBottom : 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  modalTitle: {
    fontSize: typography.title3,
    fontWeight: typography.weights.semiBold,
    color: colors.textPrimary,
  },
  countryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.separator,
  },
  countryOptionFlag: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  countryOptionText: {
    fontSize: typography.body,
    fontWeight: typography.weights.regular,
    color: colors.textPrimary,
  },
  datePickerModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  datePickerModalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    paddingBottom: Platform.OS === "ios" ? dimensions.safeAreaBottom : 0,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.separator,
  },
  datePickerTitle: {
    fontSize: typography.title3,
    fontWeight: typography.weights.semiBold,
    color: colors.textPrimary,
  },
  datePickerDone: {
    fontSize: typography.body,
    fontWeight: typography.weights.semiBold,
    color: colors.primary,
  },
  dateInputContainer: {
    padding: spacing.lg,
  },
  dateInput: {
    marginBottom: spacing.md,
  },
  dateHint: {
    fontSize: typography.footnote,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
    textAlign: "center",
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
