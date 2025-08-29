import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  ScrollView,
  Switch,
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

interface SettingsScreenProps {
  onBack?: () => void;
  userName?: string;
  onNavigateToSecurity?: () => void;
  onNavigateToPrivacy?: () => void;
  onNavigateToAccount?: () => void;
}

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

interface SettingItemProps {
  icon: string;
  label: string;
  value?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  showChevron?: boolean;
  isDestructive?: boolean;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  label,
  value,
  hasSwitch = false,
  switchValue = false,
  onSwitchChange,
  onPress,
  showChevron = true,
  isDestructive = false,
}) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    disabled={hasSwitch}
    activeOpacity={hasSwitch ? 1 : 0.7}
  >
    <View style={styles.settingItemLeft}>
      <View
        style={[
          styles.iconContainer,
          isDestructive && styles.iconContainerDestructive,
        ]}
      >
        <Ionicons
          name={icon as any}
          size={20}
          color={isDestructive ? colors.white : colors.primary}
        />
      </View>
      <View style={styles.settingTextContainer}>
        <Text
          style={[
            styles.settingLabel,
            isDestructive && styles.settingLabelDestructive,
          ]}
        >
          {label}
        </Text>
        {value && <Text style={styles.settingValue}>{value}</Text>}
      </View>
    </View>

    <View style={styles.settingItemRight}>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: "#E0E0E0", true: colors.primary }}
          thumbColor={colors.white}
          style={styles.switch}
        />
      ) : (
        showChevron && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        )
      )}
    </View>
  </TouchableOpacity>
);

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  userName = "Thibaud",
  onNavigateToSecurity,
  onNavigateToPrivacy,
  onNavigateToAccount,
}) => {
  const { logout, user } = useAuth();

  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleAccountSettings = () => {
    console.log("handleAccountSettings appelé");
    console.log("onNavigateToAccount:", onNavigateToAccount);
    if (onNavigateToAccount) {
      console.log("Navigation vers Account...");
      onNavigateToAccount();
    } else {
      console.log("onNavigateToAccount n'est pas défini");
    }
  };

  const handlePrivacy = () => {
    console.log("handlePrivacy appelé");
    console.log("onNavigateToPrivacy:", onNavigateToPrivacy);
    if (onNavigateToPrivacy) {
      console.log("Navigation vers Privacy...");
      onNavigateToPrivacy();
    } else {
      console.log("onNavigateToPrivacy n'est pas défini");
    }
  };

  const handleSecurity = () => {
    console.log("handleSecurity appelé");
    console.log("onNavigateToSecurity:", onNavigateToSecurity);
    if (onNavigateToSecurity) {
      console.log("Navigation vers Security...");
      onNavigateToSecurity();
    } else {
      console.log("onNavigateToSecurity n'est pas défini");
    }
  };

  const handleLanguage = () => {
    console.log("Navigate to Language Settings");
  };

  const handleSupport = () => {
    console.log("Navigate to Support");
  };

  const handleAbout = () => {
    console.log("Navigate to About");
  };

  const handleSignOut = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
          }
        },
      },
    ]);
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
        <Text style={styles.headerTitle}>Settings</Text>
      </FadeInView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <FadeInView delay={200}>
          <SettingSection title="Account">
            <SettingItem
              icon="person-outline"
              label="Account Information"
              value={user?.username || userName}
              onPress={handleAccountSettings}
            />
            <SettingItem
              icon="shield-checkmark-outline"
              label="Privacy & Security"
              onPress={handlePrivacy}
            />
            <SettingItem
              icon="key-outline"
              label="Password & Authentication"
              onPress={handleSecurity}
            />
          </SettingSection>
        </FadeInView>

        {/* Notifications Section */}
        <FadeInView delay={300}>
          <SettingSection title="Notifications">
            <SettingItem
              icon="notifications-outline"
              label="All Notifications"
              hasSwitch={true}
              switchValue={notificationsEnabled}
              onSwitchChange={setNotificationsEnabled}
              showChevron={false}
            />
            <SettingItem
              icon="mail-outline"
              label="Email Notifications"
              hasSwitch={true}
              switchValue={emailNotifications}
              onSwitchChange={setEmailNotifications}
              showChevron={false}
            />
            <SettingItem
              icon="phone-portrait-outline"
              label="Push Notifications"
              hasSwitch={true}
              switchValue={pushNotifications}
              onSwitchChange={setPushNotifications}
              showChevron={false}
            />
          </SettingSection>
        </FadeInView>

        {/* Preferences Section */}
        <FadeInView delay={400}>
          <SettingSection title="Preferences">
            <SettingItem
              icon="language-outline"
              label="Language"
              value="English"
              onPress={handleLanguage}
            />
            <SettingItem
              icon="moon-outline"
              label="Dark Mode"
              hasSwitch={true}
              switchValue={darkMode}
              onSwitchChange={setDarkMode}
              showChevron={false}
            />
            <SettingItem
              icon="finger-print-outline"
              label="Biometric Authentication"
              hasSwitch={true}
              switchValue={biometricAuth}
              onSwitchChange={setBiometricAuth}
              showChevron={false}
            />
          </SettingSection>
        </FadeInView>

        {/* Privacy Section */}
        <FadeInView delay={500}>
          <SettingSection title="Privacy">
            <SettingItem
              icon="analytics-outline"
              label="Analytics & Crash Reports"
              hasSwitch={true}
              switchValue={analyticsEnabled}
              onSwitchChange={setAnalyticsEnabled}
              showChevron={false}
            />
            <SettingItem
              icon="document-text-outline"
              label="Privacy Policy"
              onPress={handlePrivacy}
            />
            <SettingItem
              icon="reader-outline"
              label="Terms of Service"
              onPress={handlePrivacy}
            />
          </SettingSection>
        </FadeInView>

        {/* Support Section */}
        <FadeInView delay={600}>
          <SettingSection title="Support & About">
            <SettingItem
              icon="help-circle-outline"
              label="Help & Support"
              onPress={handleSupport}
            />
            <SettingItem
              icon="information-circle-outline"
              label="About Sana"
              value="Version 1.0.0"
              onPress={handleAbout}
            />
            <SettingItem
              icon="star-outline"
              label="Rate the App"
              onPress={handleSupport}
            />
          </SettingSection>
        </FadeInView>

        {/* Test Navigation Section */}
        <FadeInView delay={650}>
          <SettingSection title="Test Navigation">
            <SettingItem
              icon="bug-outline"
              label="Test Security"
              onPress={() => {
                console.log("Test direct Security");
                if (onNavigateToSecurity) {
                  onNavigateToSecurity();
                } else {
                  console.log("onNavigateToSecurity UNDEFINED");
                }
              }}
            />
            <SettingItem
              icon="bug-outline"
              label="Test Privacy"
              onPress={() => {
                console.log("Test direct Privacy");
                if (onNavigateToPrivacy) {
                  onNavigateToPrivacy();
                } else {
                  console.log("onNavigateToPrivacy UNDEFINED");
                }
              }}
            />
            <SettingItem
              icon="bug-outline"
              label="Test Account"
              onPress={() => {
                console.log("Test direct Account");
                if (onNavigateToAccount) {
                  onNavigateToAccount();
                } else {
                  console.log("onNavigateToAccount UNDEFINED");
                }
              }}
            />
          </SettingSection>
        </FadeInView>

        {/* Sign Out Section */}
        <FadeInView delay={700}>
          <SettingSection title="">
            <SettingItem
              icon="log-out-outline"
              label="Sign Out"
              onPress={handleSignOut}
              showChevron={false}
              isDestructive={true}
            />
          </SettingSection>
        </FadeInView>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

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
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: Platform.OS === "ios" ? dimensions.safeAreaTop + 16 : 32,
    marginBottom: 24,
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

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  // Section
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 16,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: "hidden",
    ...shadows.sm,
  },

  // Setting Item
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.04)",
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}15`, // Primary color with 15% opacity
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  iconContainerDestructive: {
    backgroundColor: "#FF5252",
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
    lineHeight: 22,
  },
  settingLabelDestructive: {
    color: "#FF5252",
  },
  settingValue: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingItemRight: {
    marginLeft: 12,
  },
  switch: {
    transform: [{ scale: 0.9 }],
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
