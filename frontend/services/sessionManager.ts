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
      console.log("Sauvegarde de la session pour:", sessionData.user.username);

      // Sauvegarde atomique avec multiSet pour éviter les incohérences
      const itemsToSave: [string, string][] = [
        [SESSION_KEYS.USER_TOKEN, sessionData.token],
        [SESSION_KEYS.USER_DATA, JSON.stringify(sessionData.user)],
        [SESSION_KEYS.REMEMBER_ME, JSON.stringify(sessionData.rememberMe)],
      ];

      // Si rememberMe est activé, pas d'expiration
      if (sessionData.rememberMe) {
        itemsToSave.push(["session_expires_at", "0"]);
        console.log("Session sauvegardée avec 'Remember Me' activé");
      } else {
        // Session expire dans 24h
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
        itemsToSave.push(["session_expires_at", expiresAt.toString()]);
        console.log("Session sauvegardée avec expiration dans 24h");
      }

      await AsyncStorage.multiSet(itemsToSave);

      // Vérification que la sauvegarde a fonctionné
      const savedToken = await AsyncStorage.getItem(SESSION_KEYS.USER_TOKEN);
      if (savedToken !== sessionData.token) {
        throw new Error("Vérification de la sauvegarde échouée");
      }

      console.log("Session sauvegardée avec succès");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la session:", error);
      // Tentative de nettoyage en cas d'erreur
      try {
        await this.clearSession();
      } catch (cleanupError) {
        console.error("Erreur lors du nettoyage:", cleanupError);
      }
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
        console.log("Session manquante: token ou userData absent");
        return null;
      }

      // Vérifier l'expiration si rememberMe n'est pas activé
      if (rememberMe !== "true" && expiresAt) {
        const expirationTime = parseInt(expiresAt);
        if (expirationTime > 0 && Date.now() > expirationTime) {
          console.log("Session expirée, suppression...");
          // Session expirée, la supprimer
          await this.clearSession();
          return null;
        }
      }

      const session = {
        token,
        user: JSON.parse(userData),
        rememberMe: rememberMe === "true",
        expiresAt: parseInt(expiresAt || "0"),
      };

      console.log("Session récupérée avec succès:", {
        username: session.user.username,
        rememberMe: session.rememberMe,
        expiresAt: session.expiresAt,
      });

      return session;
    } catch (error) {
      console.error("Erreur lors de la récupération de la session:", error);
      // En cas d'erreur, on essaie de récupérer au moins les données de base
      try {
        const token = await AsyncStorage.getItem(SESSION_KEYS.USER_TOKEN);
        const userData = await AsyncStorage.getItem(SESSION_KEYS.USER_DATA);

        if (token && userData) {
          console.log("Récupération fallback de la session");
          return {
            token,
            user: JSON.parse(userData),
            rememberMe: true, // Par défaut, on considère que c'est "remember me"
            expiresAt: 0,
          };
        }
      } catch (fallbackError) {
        console.error("Erreur fallback:", fallbackError);
      }

      return null;
    }
  }

  // Vérifier si la session est valide
  static async isSessionValid(): Promise<boolean> {
    const session = await this.getSession();
    return session !== null;
  }

  // Vérifier la persistance de la session
  static async checkSessionPersistence(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(SESSION_KEYS.USER_TOKEN);
      const userData = await AsyncStorage.getItem(SESSION_KEYS.USER_DATA);

      if (!token || !userData) {
        console.log("Vérification persistance: données manquantes");
        return false;
      }

      // Vérifier que les données sont cohérentes
      try {
        const user = JSON.parse(userData);
        if (!user.username || !user.email) {
          console.log(
            "Vérification persistance: données utilisateur invalides",
          );
          return false;
        }
      } catch (parseError) {
        console.log("Vérification persistance: erreur parsing JSON");
        return false;
      }

      console.log("Vérification persistance: session valide");
      return true;
    } catch (error) {
      console.error("Erreur lors de la vérification de persistance:", error);
      return false;
    }
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
