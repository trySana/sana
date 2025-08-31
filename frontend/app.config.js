export default {
  expo: {
    name: "Sana",
    slug: "sana",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.sana.app",
      infoPlist: {
        NSMicrophoneUsageDescription:
          "Sana a besoin d'accéder au microphone pour enregistrer vos messages vocaux et permettre la conversation avec l'IA.",
        NSMicrophoneUsageDescription:
          "Sana needs access to the microphone to record your voice messages and enable conversation with AI.",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.sana.app",
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
      ],
      targetSdkVersion: 33,
      compileSdkVersion: 33,
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
    },
    plugins: ["expo-av"],
    extra: {
      eas: {
        projectId: "your-project-id",
      },
    },
  },
};
