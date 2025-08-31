// Configuration API pour Sana
export const API_CONFIG = {
  // URLs de base
  BASE_URL: "http://localhost:8000",

  // Endpoints d'authentification
  AUTH: {
    CREATE_USER: "/create_user/",
    AUTHENTICATE: "/authentificate/",
  },

  // Endpoints de conversation
  CONVERSATION: {
    CONVERSATION: "/conversation/",
  },

  // Endpoints futurs
  FUTURE: {
    STT: "/stt/",
    MEDICAL_HISTORY: "/medical_history/",
    SYMPTOMS: "/symptoms/",
  },

  // Timeouts
  TIMEOUTS: {
    REQUEST: 10000,
    AUTH: 30000,
    CONVERSATION: 60000,
  },

  // Headers par défaut
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// URLs complètes
export const API_URLS = {
  CREATE_USER: `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.CREATE_USER}`,
  AUTHENTICATE: `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.AUTHENTICATE}`,
  CONVERSATION: `${API_CONFIG.BASE_URL}${API_CONFIG.CONVERSATION.CONVERSATION}`,
};

// Types d'erreurs API
export const API_ERROR_TYPES = {
  NETWORK_ERROR: "NETWORK_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  HEALTH_DATA_ERROR: "HEALTH_DATA_ERROR",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  AUDIO_ERROR: "AUDIO_ERROR",
  CONVERSATION_ERROR: "CONVERSATION_ERROR",
};

// Messages d'erreur utilisateur
export const USER_FRIENDLY_MESSAGES = {
  [API_ERROR_TYPES.NETWORK_ERROR]:
    "Erreur de connexion. Vérifiez votre internet.",
  [API_ERROR_TYPES.VALIDATION_ERROR]:
    "Données invalides. Vérifiez vos informations.",
  [API_ERROR_TYPES.AUTHENTICATION_ERROR]:
    "Nom d'utilisateur ou mot de passe incorrect.",
  [API_ERROR_TYPES.SERVER_ERROR]: "Erreur serveur. Réessayez plus tard.",
  [API_ERROR_TYPES.UNKNOWN_ERROR]: "Une erreur inattendue s'est produite.",
  [API_ERROR_TYPES.HEALTH_DATA_ERROR]:
    "Erreur lors de la gestion des informations de santé.",
  [API_ERROR_TYPES.USER_NOT_FOUND]:
    "Utilisateur non trouvé. Vérifiez votre nom d'utilisateur.",
  [API_ERROR_TYPES.AUDIO_ERROR]:
    "Erreur lors de l'enregistrement ou de la lecture audio.",
  [API_ERROR_TYPES.CONVERSATION_ERROR]:
    "Erreur lors de la conversation avec l'assistant IA.",
};
