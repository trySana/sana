import AsyncStorage from "@react-native-async-storage/async-storage";

// Clés de stockage
const SESSION_KEYS = {
  USER_TOKEN: "user_token",
  USER_DATA: "user_data",
  REMEMBER_ME: "remember_me",
} as const;

// Interface pour les données de session
export interface SessionData {
  token: string;
  user: {
    username: string;
    email: string;
    sex: string;
    date_of_birth: string;
  };
  rememberMe: boolean;
  expiresAt: number;
}

// Gestionnaire de sessions
export class SessionManager {
  // Sauvegarder la session
  static async saveSession(sessionData: SessionData): Promise<void> {
    try {
      await AsyncStorage.setItem(SESSION_KEYS.USER_TOKEN, sessionData.token);
      await AsyncStorage.setItem(
        SESSION_KEYS.USER_DATA,
        JSON.stringify(sessionData.user),
      );
      await AsyncStorage.setItem(
        SESSION_KEYS.REMEMBER_ME,
        JSON.stringify(sessionData.rememberMe),
      );

      // Si rememberMe est activé, pas d'expiration
      if (sessionData.rememberMe) {
        await AsyncStorage.setItem("session_expires_at", "0");
      } else {
        // Session expire dans 24h
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
        await AsyncStorage.setItem("session_expires_at", expiresAt.toString());
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la session:", error);
      throw new Error("Impossible de sauvegarder la session");
    }
  }

  // Récupérer la session
  static async getSession(): Promise<SessionData | null> {
    try {
      const token = await AsyncStorage.getItem(SESSION_KEYS.USER_TOKEN);
      const userData = await AsyncStorage.getItem(SESSION_KEYS.USER_DATA);
      const rememberMe = await AsyncStorage.getItem(SESSION_KEYS.REMEMBER_ME);
      const expiresAt = await AsyncStorage.getItem("session_expires_at");

      if (!token || !userData) {
        return null;
      }

      // Vérifier l'expiration si rememberMe n'est pas activé
      if (rememberMe !== "true" && expiresAt) {
        const expirationTime = parseInt(expiresAt);
        if (expirationTime > 0 && Date.now() > expirationTime) {
          // Session expirée, la supprimer
          await this.clearSession();
          return null;
        }
      }

      return {
        token,
        user: JSON.parse(userData),
        rememberMe: rememberMe === "true",
        expiresAt: parseInt(expiresAt || "0"),
      };
    } catch (error) {
      console.error("Erreur lors de la récupération de la session:", error);
      return null;
    }
  }

  // Vérifier si la session est valide
  static async isSessionValid(): Promise<boolean> {
    const session = await this.getSession();
    return session !== null;
  }

  // Supprimer la session
  static async clearSession(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        SESSION_KEYS.USER_TOKEN,
        SESSION_KEYS.USER_DATA,
        SESSION_KEYS.REMEMBER_ME,
        "session_expires_at",
      ]);
    } catch (error) {
      console.error("Erreur lors de la suppression de la session:", error);
    }
  }

  // Rafraîchir le token (pour les sessions avec expiration)
  static async refreshSession(): Promise<void> {
    try {
      const session = await this.getSession();
      if (session && !session.rememberMe) {
        // Prolonger la session de 24h
        const newExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
        await AsyncStorage.setItem(
          "session_expires_at",
          newExpiresAt.toString(),
        );
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement de la session:", error);
    }
  }
}
