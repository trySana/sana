import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  ApiService,
  CreateUserRequest,
  AuthenticateRequest,
  UpdateProfileRequest,
} from "../services/api";
import { SessionManager, SessionData } from "../services/sessionManager";
import { AppState } from "react-native";

// Types pour l'utilisateur
export interface User {
  username: string;
  email: string;
  sex: string;
  date_of_birth: string;
  phone_number?: string;
  bio?: string;
  profile_image?: string;
}

// Types pour le contexte
interface AuthContextType {
  // État
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (
    credentials: AuthenticateRequest & { rememberMe?: boolean },
  ) => Promise<void>;
  signup: (userData: CreateUserRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: UpdateProfileRequest) => Promise<void>;
  clearError: () => void;

  // Utilitaires
  checkAuthStatus: () => Promise<void>;
}

// Contexte d'authentification
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Props pour le provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider d'authentification
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // État local
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifier le statut d'authentification au démarrage
  useEffect(() => {
    checkAuthStatus();

    // Ajouter un listener pour les changements d'état de l'app
    const handleAppStateChange = () => {
      // Vérifier la session quand l'app revient au premier plan
      checkAuthStatus();
    };

    // Écouter les changements d'état de l'application
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  // Vérifier le statut d'authentification
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);

      // Vérifier si une session valide existe
      const session = await SessionManager.getSession();

      if (session) {
        // Définir le token dans l'API service
        ApiService.setAuthToken(session.token);

        // Mettre à jour l'état local
        setUser(session.user);
        setIsAuthenticated(true);

        // Rafraîchir la session si nécessaire
        await SessionManager.refreshSession();

        console.log("Session restaurée avec succès");
      } else {
        // Pas de session valide
        setIsAuthenticated(false);
        setUser(null);
        console.log("Aucune session valide trouvée");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification du statut d'authentification:",
        error,
      );
      // En cas d'erreur, on ne déconnecte pas automatiquement
      // On garde l'état actuel et on essaie de récupérer la session
      try {
        const fallbackSession = await SessionManager.getSession();
        if (fallbackSession) {
          ApiService.setAuthToken(fallbackSession.token);
          setUser(fallbackSession.user);
          setIsAuthenticated(true);
          console.log("Session récupérée en fallback");
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (fallbackError) {
        console.error("Erreur fallback:", fallbackError);
        setIsAuthenticated(false);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Connexion
  const login = async (
    credentials: AuthenticateRequest & { rememberMe?: boolean },
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await ApiService.authenticate(credentials);

      if (response.success) {
        // Créer un token simple (en attendant que le backend génère des vrais tokens)
        const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Sauvegarder la session
        const sessionData: SessionData = {
          token,
          user: response.user,
          rememberMe: credentials.rememberMe || false,
          expiresAt: 0,
        };

        await SessionManager.saveSession(sessionData);

        // Définir le token dans l'API service
        ApiService.setAuthToken(token);

        // Mettre à jour l'état local
        setUser(response.user);
        setIsAuthenticated(true);

        console.log("Connexion réussie, session sauvegardée");
      } else {
        setError(response.message || "Échec de l'authentification");
      }
    } catch (error: any) {
      setError(error.userMessage || "Erreur lors de la connexion");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Inscription
  const signup = async (userData: CreateUserRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await ApiService.createUser(userData);

      if (response.success) {
        // Créer automatiquement la session après l'inscription
        await login({
          username: userData.username,
          password: userData.password,
        });
      } else {
        setError(response.message || "Échec de l'inscription");
      }
    } catch (error: any) {
      setError(error.userMessage || "Erreur lors de l'inscription");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      console.log("🚪 [LOGOUT] Début de la déconnexion...");

      // Supprimer la session
      console.log("🚪 [LOGOUT] Suppression de la session...");
      await SessionManager.clearSession();
      console.log("🚪 [LOGOUT] Session supprimée avec succès");

      // Supprimer le token de l'API service
      console.log("🚪 [LOGOUT] Suppression du token API...");
      ApiService.clearAuthToken();
      console.log("🚪 [LOGOUT] Token API supprimé");

      // Mettre à jour l'état local
      console.log("🚪 [LOGOUT] Mise à jour de l'état local...");
      setUser(null);
      setIsAuthenticated(false);
      console.log(
        "🚪 [LOGOUT] État local mis à jour: user=null, isAuthenticated=false",
      );

      console.log("🚪 [LOGOUT] Déconnexion réussie, session supprimée");
    } catch (error) {
      console.error("❌ [LOGOUT] Erreur lors de la déconnexion:", error);
      // Même en cas d'erreur, on déconnecte l'utilisateur localement
      console.log("🚪 [LOGOUT] Fallback: déconnexion locale malgré l'erreur");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Mise à jour du profil
  const updateProfile = async (profileData: UpdateProfileRequest) => {
    try {
      if (!user) {
        throw new Error("Utilisateur non connecté");
      }

      setIsLoading(true);
      setError(null);

      const response = await ApiService.updateProfile(
        user.username,
        profileData,
      );

      if (response.success) {
        // Mettre à jour l'utilisateur local
        const updatedUser = { ...user, ...profileData };
        setUser(updatedUser);

        // Mettre à jour la session
        const session = await SessionManager.getSession();
        if (session) {
          const updatedSession: SessionData = {
            ...session,
            user: updatedUser,
          };
          await SessionManager.saveSession(updatedSession);
        }

        console.log("Profil mis à jour avec succès");
      } else {
        setError(response.message || "Échec de la mise à jour du profil");
      }
    } catch (error: any) {
      setError(error.userMessage || "Erreur lors de la mise à jour du profil");
      console.error("Update profile error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effacer les erreurs
  const clearError = () => {
    setError(null);
  };

  // Valeur du contexte
  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
