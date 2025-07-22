import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  Animated,
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

interface ProfileScreenProps {
  onBack?: () => void;
  onNavigateToSettings?: () => void;
  userName?: string;
  userImage?: string;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onNavigateToSettings,
  userName = "Thibaud",
  userImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const jobsData = [
    { title: "Product Design", icon: "color-palette-outline" },
    { title: "Front end", icon: "code-slash-outline" },
    { title: "Visual Designer", icon: "brush-outline" },
    { title: "Voyager", icon: "airplane-outline" },
  ];

  return (
    <GradientBackground variant="main" style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={Platform.OS === "android"}
      />

      {/* Header Épuré */}
      <FadeInView delay={100} style={styles.simpleHeader}>
        <TouchableOpacity
          style={styles.simpleBackButton}
          onPress={handleBack}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Animated.View>
        </TouchableOpacity>
        <Text style={styles.simpleHeaderTitle}>Profile</Text>

        {/* Settings Button */}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={onNavigateToSettings}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Ionicons
              name="settings-outline"
              size={24}
              color={colors.textPrimary}
            />
          </Animated.View>
        </TouchableOpacity>
      </FadeInView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section Ultra-Épurée */}
        <FadeInView delay={200} style={styles.profileSection}>
          <View style={styles.cleanProfileCard}>
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: userImage }} style={styles.profileImage} />
              <View style={styles.onlineIndicator} />
            </View>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileSubtitle}>Creative Professional</Text>
          </View>
        </FadeInView>

        {/* Info Cards Ultra-Épurées */}
        <FadeInView delay={300} style={styles.infoSection}>
          <View style={styles.cleanInfoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons
                  name="briefcase-outline"
                  size={18}
                  color={colors.primary}
                />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Profession</Text>
                  <Text style={styles.infoValue}>Contractor</Text>
                </View>
              </View>
            </View>

            <View style={styles.cleanSeparator} />

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons
                  name="call-outline"
                  size={18}
                  color={colors.primary}
                />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Contact</Text>
                  <Text style={styles.infoValue}>+234 806 2344 4675</Text>
                </View>
              </View>
            </View>

            <View style={styles.cleanSeparator} />

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={colors.primary}
                />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>Lagos</Text>
                </View>
              </View>
            </View>

            <View style={styles.cleanSeparator} />

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons
                  name={
                    isOpen ? "checkmark-circle-outline" : "close-circle-outline"
                  }
                  size={18}
                  color={isOpen ? "#4CAF50" : "#FF6B6B"}
                />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Position</Text>
                  <Text
                    style={[
                      styles.infoValue,
                      { color: isOpen ? "#4CAF50" : "#FF6B6B" },
                    ]}
                  >
                    {isOpen ? "Open" : "Closed"}
                  </Text>
                </View>
              </View>
              <Switch
                value={isOpen}
                onValueChange={setIsOpen}
                trackColor={{ false: "#E0E0E0", true: colors.primary }}
                thumbColor={colors.white}
                style={styles.cleanSwitch}
              />
            </View>
          </View>
        </FadeInView>

        {/* Modern Jobs Section */}
        <FadeInView delay={400} style={styles.jobsSection}>
          <Text style={styles.modernSectionTitle}>Skills & Expertise</Text>

          <View style={styles.cleanJobsGrid}>
            {jobsData.map((job, index) => (
              <FadeInView key={index} delay={500 + index * 100}>
                <View style={styles.cleanJobCard}>
                  <Ionicons
                    name={job.icon as any}
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.cleanJobText}>{job.title}</Text>
                </View>
              </FadeInView>
            ))}
          </View>
        </FadeInView>

        {/* Stats Section - Ultra Épurée */}
        <FadeInView delay={600} style={styles.cleanStatsSection}>
          {/* Simple Stats Grid */}
          <View style={styles.cleanStatsGrid}>
            <View style={styles.cleanStatCard}>
              <Text style={styles.cleanStatNumber}>4.3</Text>
              <Text style={styles.cleanStatLabel}>Rating</Text>
            </View>

            <View style={styles.cleanStatCard}>
              <Text style={styles.cleanStatNumber}>37</Text>
              <Text style={styles.cleanStatLabel}>Projects</Text>
            </View>

            <View style={styles.cleanStatCard}>
              <Text style={styles.cleanStatNumber}>02</Text>
              <Text style={styles.cleanStatLabel}>Active</Text>
            </View>
          </View>

          {/* Simple Pay Range */}
          <View style={styles.cleanPayCard}>
            <Text style={styles.cleanPayLabel}>Daily Rate</Text>
            <Text style={styles.cleanPayValue}>$150 - $200</Text>
          </View>
        </FadeInView>

        <View style={{ height: 100 }} />
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? dimensions.safeAreaTop : 35,
  },

  // Header Épuré
  simpleHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 32,
  },
  simpleBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  simpleHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    flex: 1, // Allow title to take remaining space
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },

  // Modern Profile Section - Épuré
  profileSection: {
    marginBottom: 40,
  },
  cleanProfileCard: {
    alignItems: "center",
    paddingVertical: 48, // Espacement vertical généreux
    paddingHorizontal: 24, // Espacement horizontal modéré
    borderRadius: 0, // Suppression des coins arrondis pour épurement
    backgroundColor: "transparent", // Complètement transparent
    borderWidth: 0,
    ...shadows.none, // Aucune ombre
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    borderWidth: 3,
    borderColor: colors.white,
  },
  profileName: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 5,
  },
  profileSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textSecondary,
    opacity: 0.8,
  },

  // Info Cards - Ultra Épuré
  infoSection: {
    marginBottom: 48,
  },
  cleanInfoContainer: {
    paddingVertical: 24, // Espacement vertical seulement
    paddingHorizontal: 0, // Supprimé pour plus d'épurement
    borderRadius: 0, // Complètement géométrique
    backgroundColor: "transparent", // Transparent
    borderWidth: 0,
    ...shadows.none,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16, // Double espacement
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  cleanSeparator: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.06)", // Séparateur très subtil
    marginVertical: 20, // Plus d'espacement
    marginHorizontal: 0, // Pleine largeur
  },
  cleanSwitch: {
    transform: [{ scale: 0.9 }], // Plus petit pour discrétion
  },

  // Modern Jobs Section - Simplifiée
  jobsSection: {
    marginBottom: 50, // Plus d'espace
  },
  modernSectionTitle: {
    fontSize: 20, // Plus petit, moins imposant
    fontWeight: "600", // Moins bold
    color: colors.textPrimary,
    textAlign: "left", // Aligné à gauche
    marginBottom: 24,
    marginLeft: 8, // Petit décalage
  },
  cleanJobsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 24, // Plus d'espacement pour épurement
  },
  cleanJobCard: {
    width: "46%", // Plus petit pour le gap augmenté
    paddingVertical: 24, // Plus d'espacement vertical
    paddingHorizontal: 16,
    marginBottom: 0,
    borderRadius: 0, // Complètement géométrique
    backgroundColor: "transparent", // Transparent complet
    borderWidth: 0,
    alignItems: "center",
    ...shadows.none,
  },
  cleanJobText: {
    fontSize: 13, // Légèrement plus petit
    fontWeight: "500", // Moins bold
    color: colors.textPrimary,
    marginTop: 12, // Plus d'espace
    textAlign: "center",
    lineHeight: 16,
  },

  // Stats Section - Ultra Épurée
  cleanStatsSection: {
    marginBottom: 40,
  },
  cleanStatsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 32,
  },
  cleanStatCard: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 16,
  },
  cleanStatNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cleanStatLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    textAlign: "center",
  },

  // Pay Range - Épuré
  cleanPayCard: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  cleanPayLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  cleanPayValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
});
