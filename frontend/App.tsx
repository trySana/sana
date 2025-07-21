import React, { useState } from "react";
import {
  SplashScreen,
  OnboardingScreen,
  LoginScreen,
  SignUpScreen,
  HomeScreen,
} from "./screens";

type AppState = "splash" | "onboarding" | "login" | "signup" | "home";

export default function App() {
  const [appState, setAppState] = useState<AppState>("splash");

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
    setAppState("home");
    console.log("Login réussi → Navigation vers home");
  };

  const handleSignUpSuccess = () => {
    setAppState("home");
    console.log("Sign up réussi → Navigation vers home");
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
    console.log("Profil pressé");
    // TODO: Navigation vers profil
  };

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

  // Fallback
  return null;
}
