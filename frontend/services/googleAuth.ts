import {
  GoogleSignin,
  statusCodes,
  type User,
  type SignInResponse,
  type SignInSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { Platform } from "react-native";
import { GOOGLE_CONFIG } from "../config/google";

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  givenName?: string;
  familyName?: string;
  photo?: string;
}

export interface GoogleAuthResult {
  success: boolean;
  user?: GoogleUser;
  error?: string;
  accessToken?: string;
}

class GoogleAuthService {
  private static instance: GoogleAuthService;

  private constructor() {
    this.configureGoogleSignin();
  }

  public static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  private configureGoogleSignin() {
    GoogleSignin.configure(GOOGLE_CONFIG.NATIVE_CONFIG);
  }

  /**
   * Authentification Google native
   */
  async signIn(): Promise<GoogleAuthResult> {
    try {
      console.log("[GoogleAuth] Tentative de connexion...");

      if (Platform.OS === "android") {
        await GoogleSignin.hasPlayServices();
      }

      const userInfo: SignInResponse = await GoogleSignin.signIn();
      console.log("[GoogleAuth] Connexion réussie:", userInfo);

      if (userInfo.type !== "success") {
        return {
          success: false,
          error: "Connexion annulée par l'utilisateur",
        };
      }

      const tokens = await GoogleSignin.getTokens();

      const user: GoogleUser = {
        id: userInfo.data.idToken || "",
        email: userInfo.data.user.email || "",
        name: userInfo.data.user.name || "",
        givenName: userInfo.data.user.givenName || undefined,
        familyName: userInfo.data.user.familyName || undefined,
        photo: userInfo.data.user.photo || undefined,
      };

      return {
        success: true,
        user,
        accessToken: tokens.accessToken,
      };
    } catch (error: any) {
      console.error("[GoogleAuth] Erreur de connexion:", error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return {
          success: false,
          error: "Connexion annulée par l'utilisateur",
        };
      } else if (error.code === statusCodes.IN_PROGRESS) {
        return {
          success: false,
          error: "Connexion déjà en cours",
        };
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return {
          success: false,
          error: "Google Play Services non disponible",
        };
      } else {
        return {
          success: false,
          error: "Erreur de connexion Google",
        };
      }
    }
  }

  /**
   * Se déconnecter de Google
   */
  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
      console.log("[GoogleAuth] Déconnexion réussie");
    } catch (error) {
      console.error("[GoogleAuth] Erreur lors de la déconnexion:", error);
    }
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  async isSignedIn(): Promise<boolean> {
    try {
      const isSignedIn = GoogleSignin.hasPreviousSignIn();
      console.log("[GoogleAuth] Utilisateur connecté:", isSignedIn);
      return isSignedIn;
    } catch (error) {
      console.error(
        "[GoogleAuth] Erreur lors de la vérification de connexion:",
        error,
      );
      return false;
    }
  }

  /**
   * Récupérer l'utilisateur actuellement connecté
   */
  async getCurrentUser(): Promise<GoogleUser | null> {
    try {
      const currentUser: User | null = GoogleSignin.getCurrentUser();
      if (currentUser) {
        return {
          id: currentUser.idToken || "",
          email: currentUser.user.email || "",
          name: currentUser.user.name || "",
          givenName: currentUser.user.givenName || undefined,
          familyName: currentUser.user.familyName || undefined,
          photo: currentUser.user.photo || undefined,
        };
      }
      return null;
    } catch (error) {
      console.error(
        "[GoogleAuth] Erreur lors de la récupération de l'utilisateur actuel:",
        error,
      );
      return null;
    }
  }
}

export default GoogleAuthService;
