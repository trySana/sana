import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import {
  SplashScreen,
  OnboardingScreen,
  LoginScreen,
  SignUpScreen,
  HomeScreen,
  ProfileScreen,
  EditProfileScreen,
  SecurityScreen,
  PrivacyScreen,
  AccountScreen,
  SettingsScreen,
} from "./screens";
import { LoadingScreen } from "./components/common";

type AppState =
  | "splash"
  | "onboarding"
  | "login"
  | "signup"
  | "home"
  | "profile"
  | "editProfile"
  | "settings"
  | "security"
  | "privacy"
  | "account";

function App() {
  const [appState, setAppState] = useState<AppState>("splash");
  const { isAuthenticated, isLoading } = useAuth();

  // Navigation automatique basée sur l'état d'authentification
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && appState === "login") {
        setAppState("home");
        console.log("Utilisateur authentifié → Navigation vers home");
      } else if (
        !isAuthenticated &&
        appState !== "splash" &&
        appState !== "onboarding" &&
        appState !== "login"
      ) {
        setAppState("login");
        console.log("Utilisateur non authentifié → Navigation vers login");
      }
    }
  }, [isAuthenticated, isLoading]);

  // Navigation handlers
  const handleSplashComplete = () => {
    setAppState("onboarding");
    console.log("Splash terminé → Navigation vers onboarding");
  };

  const handleOnboardingComplete = () => {
    setAppState("login");
    console.log("Onboarding terminé → Navigation vers login");
  };

  const handleLoginSuccess = () => {
    // Plus besoin de gérer manuellement la redirection
    console.log("Login réussi → Redirection automatique via contexte");
  };

  const handleSignUpSuccess = () => {
    // Plus besoin de gérer manuellement la redirection
    console.log("Sign up réussi → Redirection automatique via contexte");
  };

  const handleNavigateToSignUp = () => {
    setAppState("signup");
    console.log("Navigation vers sign up");
  };

  const handleNavigateToLogin = () => {
    setAppState("login");
    console.log("Navigation vers login");
  };

  const handleBackToLogin = () => {
    setAppState("login");
    console.log("Retour vers login");
  };

  const handleForgotPassword = () => {
    console.log("Mot de passe oublié");
    // TODO: Implémenter la réinitialisation de mot de passe
  };

  const handleVoicePress = () => {
    console.log("Bouton vocal pressé");
    // TODO: Implémenter la reconnaissance vocale
  };

  const handleProfilePress = () => {
    setAppState("profile");
    console.log("Navigation vers profil");
  };

  const handleBackToHome = () => {
    setAppState("home");
    console.log("Retour vers home");
  };

  const handleNavigateToSettings = () => {
    setAppState("settings");
    console.log("Navigation vers settings");
  };

  const handleNavigateToEditProfile = () => {
    setAppState("editProfile");
    console.log("Navigation vers édition du profil");
  };

  const handleNavigateToSecurity = () => {
    console.log(
      "handleNavigateToSecurity appelé - changement d'état vers security",
    );
    setAppState("security");
    console.log("Navigation vers sécurité");
  };

  const handleNavigateToPrivacy = () => {
    console.log(
      "handleNavigateToPrivacy appelé - changement d'état vers privacy",
    );
    setAppState("privacy");
    console.log("Navigation vers confidentialité");
  };

  const handleNavigateToAccount = () => {
    console.log(
      "handleNavigateToAccount appelé - changement d'état vers account",
    );
    setAppState("account");
    console.log("Navigation vers informations du compte");
  };

  const handleBackToProfile = () => {
    setAppState("profile");
    console.log("Retour vers profil");
  };

  const handleBackToSettings = () => {
    setAppState("settings");
    console.log("Retour vers paramètres");
  };

  // Écran de chargement pendant la vérification de l'authentification
  if (isLoading) {
    return <LoadingScreen message="Vérification de la connexion..." />;
  }

  // Écran de splash
  if (appState === "splash") {
    return <SplashScreen onAnimationComplete={handleSplashComplete} />;
  }

  // Écrans d'onboarding
  if (appState === "onboarding") {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Écran de connexion
  if (appState === "login") {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onNavigateToSignUp={handleNavigateToSignUp}
        onForgotPassword={handleForgotPassword}
      />
    );
  }

  // Écran d'inscription
  if (appState === "signup") {
    return (
      <SignUpScreen
        onSignUpSuccess={handleSignUpSuccess}
        onNavigateToLogin={handleNavigateToLogin}
        onBack={handleBackToLogin}
      />
    );
  }

  // Application principale
  if (appState === "home") {
    return (
      <HomeScreen
        userName="Thibaud"
        onVoicePress={handleVoicePress}
        onProfilePress={handleProfilePress}
      />
    );
  }

  // Écran de profil
  if (appState === "profile") {
    return (
      <ProfileScreen
        userName="Thibaud"
        onBack={handleBackToHome}
        onNavigateToSettings={handleNavigateToSettings}
        onNavigateToEditProfile={handleNavigateToEditProfile}
      />
    );
  }

  // Écran d'édition du profil
  if (appState === "editProfile") {
    return (
      <EditProfileScreen
        onBack={handleBackToProfile}
        onSave={handleBackToProfile}
      />
    );
  }

  // Écran de sécurité
  if (appState === "security") {
    return <SecurityScreen onBack={handleBackToSettings} />;
  }

  // Écran de confidentialité
  if (appState === "privacy") {
    return <PrivacyScreen onBack={handleBackToSettings} />;
  }

  // Écran d'informations du compte
  if (appState === "account") {
    return <AccountScreen onBack={handleBackToSettings} />;
  }

  // Écran de paramètres
  if (appState === "settings") {
    return (
      <SettingsScreen
        userName="Thibaud"
        onBack={handleBackToProfile}
        onNavigateToSecurity={handleNavigateToSecurity}
        onNavigateToPrivacy={handleNavigateToPrivacy}
        onNavigateToAccount={handleNavigateToAccount}
      />
    );
  }

  // Fallback
  return null;
}

// Wrapper principal avec AuthProvider
export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
