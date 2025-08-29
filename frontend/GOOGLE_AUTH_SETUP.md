# 🔐 Configuration de l'Authentification Google pour Sana

Ce guide vous explique comment configurer l'authentification Google pour votre application Sana.

## 📋 Prérequis

- Un compte Google
- Un projet Google Cloud Console
- Expo CLI installé (pour le développement)

## 🚀 Étapes de Configuration

### 1. Créer un Projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Cliquez sur "Sélectionner un projet" puis "Nouveau projet"
3. Donnez un nom à votre projet (ex: "Sana Health App")
4. Cliquez sur "Créer"

### 2. Activer l'API Google+ API

1. Dans votre projet, allez dans "APIs et services" > "Bibliothèque"
2. Recherchez "Google+ API"
3. Cliquez dessus et cliquez sur "Activer"

### 3. Créer des Identifiants OAuth 2.0

1. Allez dans "APIs et services" > "Identifiants"
2. Cliquez sur "Créer des identifiants" > "ID client OAuth"
3. Sélectionnez "Application mobile (Android, iOS)"
4. Donnez un nom à votre client OAuth
5. Cliquez sur "Créer"

### 4. Configurer les URIs de Redirection

Pour le développement avec Expo :

1. Dans les identifiants OAuth, cliquez sur votre client
2. Ajoutez ces URIs de redirection :
   - `https://auth.expo.io/@your-username/your-app`
   - `com.googleusercontent.apps.YOUR_CLIENT_ID`

### 5. Mettre à Jour la Configuration

1. Ouvrez `frontend/config/google.ts`
2. Remplacez `YOUR_GOOGLE_CLIENT_ID` par votre vrai Client ID
3. Remplacez `@your-username/your-app` par vos vraies informations Expo

### 6. Configuration Android (optionnel)

Si vous développez pour Android :

1. Ajoutez votre empreinte SHA-1 dans Google Cloud Console
2. Configurez `google-services.json` dans votre projet Android

## 🔧 Utilisation dans l'Application

### Connexion

```typescript
import GoogleAuthService from "../services/googleAuth";

const googleAuth = GoogleAuthService.getInstance();
const result = await googleAuth.signIn();

if (result.success) {
  console.log("Connecté avec:", result.user.name);
} else {
  console.error("Erreur:", result.error);
}
```

### Déconnexion

```typescript
await googleAuth.signOut();
```

### Vérifier l'état de connexion

```typescript
const isConnected = await googleAuth.isSignedIn();
```

## 🚨 Dépannage

### Erreur "Google Play Services non disponible"

- Vérifiez que Google Play Services est installé sur l'appareil
- Mettez à jour Google Play Services

### Erreur "Client ID invalide"

- Vérifiez que votre Client ID est correct dans `config/google.ts`
- Assurez-vous que l'API Google+ API est activée

### Erreur "URI de redirection invalide"

- Vérifiez vos URIs de redirection dans Google Cloud Console
- Assurez-vous que l'URI Expo est correct

## 📱 Test

1. Lancez votre application
2. Cliquez sur "Continue with Google"
3. Sélectionnez votre compte Google
4. Autorisez l'application
5. Vérifiez que la connexion fonctionne

## 🔒 Sécurité

- Ne partagez jamais votre Client Secret
- Utilisez des URIs de redirection sécurisés
- Testez sur des appareils physiques
- Validez les tokens côté serveur

## 📚 Ressources

- [Documentation Google Sign-In](https://developers.google.com/identity/sign-in/android)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Expo AuthSession](https://docs.expo.dev/versions/latest/sdk/auth-session/)

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs de la console
2. Vérifiez la configuration Google Cloud Console
3. Testez sur un appareil physique
4. Consultez la documentation officielle
