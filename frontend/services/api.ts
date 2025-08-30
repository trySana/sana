import {
  API_URLS,
  API_ERROR_TYPES,
  USER_FRIENDLY_MESSAGES,
} from "../constants/api";

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
  sex: string;
  date_of_birth: string;
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
  user_id: string;
}

export interface AuthenticateRequest {
  username: string;
  password: string;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  sex?: string;
  date_of_birth?: string;
  phone_number?: string;
  bio?: string;
  profile_image?: string;
}

export interface AuthenticateResponse {
  success: boolean;
  message: string;
  user: {
    username: string;
    email: string;
    sex: string;
    date_of_birth: string;
    phone_number?: string;
    bio?: string;
    profile_image?: string;
  };
}

export interface HealthInfoRequest {
  height?: number;
  weight?: number;
  blood_type?: string;
  medical_conditions?: string[];
  allergies?: string[];
  medications?: string[];
  smoking_status?: string;
  alcohol_consumption?: string;
  exercise_frequency?: string;
  family_history?: string[];
}

export interface HealthInfoResponse {
  success: boolean;
  message: string;
  health_data?: any;
}

// Classe pour gérer les erreurs API
export class ApiError extends Error {
  type: string;
  statusCode?: number;
  userMessage: string;

  constructor(message: string, type: string, statusCode?: number) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.userMessage =
      USER_FRIENDLY_MESSAGES[type] ||
      USER_FRIENDLY_MESSAGES[API_ERROR_TYPES.UNKNOWN_ERROR];
  }
}

// Service API principal
export class ApiService {
  private static token: string | null = null;

  // Définir le token d'authentification
  static setAuthToken(token: string) {
    this.token = token;
  }

  // Supprimer le token d'authentification
  static clearAuthToken() {
    this.token = null;
  }

  private static async makeRequest<T>(
    url: string,
    options: RequestInit = {},
  ): Promise<T> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      // Ajouter les headers personnalisés si fournis
      if (options.headers) {
        Object.assign(headers, options.headers);
      }

      // Ajouter le token d'authentification si disponible
      if (this.token) {
        headers["Authorization"] = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        headers,
        ...options,
      });

      if (!response.ok) {
        let errorType = API_ERROR_TYPES.SERVER_ERROR;
        let errorMessage = "Erreur serveur";

        if (response.status === 401) {
          errorType = API_ERROR_TYPES.AUTHENTICATION_ERROR;
          errorMessage = "Authentification échouée";
        } else if (response.status === 422) {
          errorType = API_ERROR_TYPES.VALIDATION_ERROR;
          errorMessage = "Données invalides";
        } else if (response.status >= 500) {
          errorType = API_ERROR_TYPES.SERVER_ERROR;
          errorMessage = "Erreur serveur interne";
        }

        throw new ApiError(errorMessage, errorType, response.status);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new ApiError(
          "Erreur de connexion réseau",
          API_ERROR_TYPES.NETWORK_ERROR,
        );
      }

      throw new ApiError(
        error instanceof Error ? error.message : "Erreur inconnue",
        API_ERROR_TYPES.UNKNOWN_ERROR,
      );
    }
  }

  // Créer un utilisateur
  static async createUser(
    userData: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    return this.makeRequest<CreateUserResponse>(API_URLS.CREATE_USER, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // Authentifier un utilisateur
  static async authenticate(
    credentials: AuthenticateRequest,
  ): Promise<AuthenticateResponse> {
    return this.makeRequest<AuthenticateResponse>(API_URLS.AUTHENTICATE, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  // Test de connexion à l'API
  static async healthCheck(): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>("http://localhost:8000/");
  }

  // Mettre à jour le profil utilisateur
  static async updateProfile(
    username: string,
    profileData: UpdateProfileRequest,
  ): Promise<{ success: boolean; message: string; updated_fields: string[] }> {
    return this.makeRequest<{
      success: boolean;
      message: string;
      updated_fields: string[];
    }>(`http://localhost:8000/update_profile/${username}`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  static async updateHealthInfo(
    username: string,
    healthData: HealthInfoRequest,
  ): Promise<HealthInfoResponse> {
    try {
      console.log(
        `[API] Mise à jour des informations de santé pour ${username}:`,
        healthData,
      );

      const response = await this.makeRequest<HealthInfoResponse>(
        `http://localhost:8000/health_info/${username}/update`,
        {
          method: "POST",
          body: JSON.stringify(healthData),
        },
      );

      console.log(`[API] Réponse de mise à jour:`, response);

      if (!response.success) {
        throw new ApiError(
          response.message ||
            "Échec de la mise à jour des informations de santé",
          API_ERROR_TYPES.HEALTH_DATA_ERROR,
        );
      }

      return response;
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des informations de santé:",
        error,
      );

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        "Erreur lors de la mise à jour des informations de santé",
        API_ERROR_TYPES.HEALTH_DATA_ERROR,
      );
    }
  }

  static async getHealthInfo(username: string): Promise<HealthInfoResponse> {
    try {
      console.log(
        `[API] Récupération des informations de santé pour ${username}`,
      );

      const response = await this.makeRequest<HealthInfoResponse>(
        `http://localhost:8000/health_info_v2/${username}`,
        {
          method: "GET",
        },
      );

      console.log(`[API] Réponse de récupération:`, response);

      if (!response.success) {
        if (response.message.includes("non trouvé")) {
          throw new ApiError(response.message, API_ERROR_TYPES.USER_NOT_FOUND);
        }
        throw new ApiError(
          response.message ||
            "Échec de la récupération des informations de santé",
          API_ERROR_TYPES.HEALTH_DATA_ERROR,
        );
      }

      return response;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations de santé:",
        error,
      );

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        "Erreur lors de la récupération des informations de santé",
        API_ERROR_TYPES.HEALTH_DATA_ERROR,
      );
    }
  }

  // Changer le mot de passe
  static async changePassword(
    username: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`[API] Changement de mot de passe pour ${username}`);

      if (newPassword !== confirmPassword) {
        throw new ApiError(
          "Les nouveaux mots de passe ne correspondent pas",
          API_ERROR_TYPES.VALIDATION_ERROR,
        );
      }

      const response = await this.makeRequest<{
        success: boolean;
        message: string;
      }>(`http://localhost:8000/change_password/${username}`, {
        method: "POST",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      console.log(`[API] Réponse changement mot de passe:`, response);

      if (!response.success) {
        throw new ApiError(
          response.message || "Échec du changement de mot de passe",
          API_ERROR_TYPES.AUTHENTICATION_ERROR,
        );
      }

      return response;
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        "Erreur lors du changement de mot de passe",
        API_ERROR_TYPES.AUTHENTICATION_ERROR,
      );
    }
  }
}
