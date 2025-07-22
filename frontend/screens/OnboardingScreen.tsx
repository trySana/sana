import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { GradientBackground, Button } from "../components/common";
import { PageIndicator } from "../components/onboarding/PageIndicator";
import { OnboardingPage } from "../components/onboarding/OnboardingPage";
import {
  ModernHealthIllustration,
  ModernAIIllustration,
  ModernCompanionIllustration,
} from "../components/illustrations";
import {
  colors,
  spacing,
  dimensions,
  shadows,
  animations,
} from "../constants/theme";

interface OnboardingScreenProps {
  onComplete?: () => void;
}

const { width: screenWidth } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    title: "This is an onboarding with illustrations",
    description:
      "Talk about one of features of your application & how it will help your users",
    illustration: <ModernHealthIllustration size={250} />,
  },
  {
    id: 2,
    title: "Discover all about your new app experience",
    description:
      "The final screen can end on a happy note. All the best for your project",
    illustration: <ModernAIIllustration size={250} />,
  },
  {
    id: 3,
    title: "Quick prototyping can help you validate",
    description:
      "Bring the designs of your dreams into reality with the power of spectre",
    illustration: <ModernCompanionIllustration size={250} />,
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const page = Math.round(scrollPosition / screenWidth);
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      // Animation Apple smooth
      scrollViewRef.current?.scrollTo({
        x: nextPage * screenWidth,
        animated: true,
      });
    } else {
      // Dernière page - terminer l'onboarding avec animation
      if (onComplete) {
        // Délai pour animation smooth avant transition
        setTimeout(() => {
          onComplete();
        }, 100);
      }
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      // Animation Apple smooth
      scrollViewRef.current?.scrollTo({
        x: prevPage * screenWidth,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <GradientBackground variant="onboarding" style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={Platform.OS === "android"}
        hidden={Platform.OS === "ios"}
      />

      {/* Skip button supprimé pour design épuré */}

      {/* Pages content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        decelerationRate="fast"
        snapToInterval={screenWidth}
        snapToAlignment="start"
      >
        {onboardingData.map((item, index) => (
          <OnboardingPage
            key={item.id}
            title={item.title}
            description={item.description}
            illustration={item.illustration}
            isActive={index === currentPage}
          />
        ))}
      </ScrollView>

      {/* Bottom Navigation Épurée */}
      <View style={styles.cleanBottomContainer}>
        {/* Page Indicator */}
        <PageIndicator
          totalPages={onboardingData.length}
          currentPage={currentPage}
        />

        {/* Navigation Buttons Épurés */}
        <View style={styles.cleanButtonContainer}>
          <Button
            title={
              currentPage === onboardingData.length - 1 ? "Get Started" : "Next"
            }
            onPress={handleNext}
            variant="primary"
            style={styles.cleanNextButton}
          />
        </View>
      </View>

      {/* Mobile home indicator */}
      {Platform.OS === "ios" && <View style={styles.homeIndicator} />}
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Skip button supprimé pour épurement
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "flex-start", // Correction pour l'alignement
    flexDirection: "row",
  },
  cleanBottomContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: Platform.OS === "ios" ? dimensions.safeAreaBottom + 32 : 32,
    backgroundColor: "transparent", // Transparent pour épurement
    borderTopWidth: 0, // Supprimé
    ...shadows.none, // Aucune ombre
  },
  cleanButtonContainer: {
    alignItems: "center",
    paddingTop: 24,
  },
  cleanNextButton: {
    width: "100%",
    maxWidth: 280, // Largeur limitée pour design épuré
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
