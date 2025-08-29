// Configuration Google OAuth pour Sana
// Remplacez ces valeurs par vos vrais identifiants Google

export const GOOGLE_CONFIG = {
  // Client ID OAuth 2.0 de Google Cloud Console
  CLIENT_ID: "YOUR_GOOGLE_CLIENT_ID",

  // Client Secret (optionnel pour les applications mobiles)
  CLIENT_SECRET: "YOUR_GOOGLE_CLIENT_SECRET",

  // Scopes OAuth requis
  SCOPES: ["openid", "email", "profile"],

  // URI de redirection pour Expo
  REDIRECT_URI: "https://auth.expo.io/@your-username/your-app",

  // Configuration pour React Native
  NATIVE_CONFIG: {
    webClientId: "YOUR_GOOGLE_CLIENT_ID",
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  },
};

// Instructions de configuration :
// 1. Allez sur https://console.cloud.google.com/
// 2. Créez un nouveau projet ou sélectionnez un existant
// 3. Activez l'API Google+ API
// 4. Créez des identifiants OAuth 2.0
// 5. Ajoutez vos URIs de redirection
// 6. Remplacez YOUR_GOOGLE_CLIENT_ID par votre vrai Client ID
