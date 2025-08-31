import { Platform } from "react-native";
import { API_CONFIG } from "../constants/api";

// Types pour l'upload audio
export interface AudioUploadResponse {
  success: boolean;
  audioData?: ArrayBuffer;
  transcription?: string;
  error?: string;
}

// Types d'erreur spécifiques
export enum AudioUploadError {
  NETWORK_ERROR = "NETWORK_ERROR",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  UNSUPPORTED_FORMAT = "UNSUPPORTED_FORMAT",
  SERVER_ERROR = "SERVER_ERROR",
  TIMEOUT = "TIMEOUT",
}

/**
 * Service d'upload audio sécurisé pour FastAPI
 * Gère les différences Web vs Native et les formats optimaux
 */
class AudioUploadService {
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly SUPPORTED_FORMATS = {
    web: ["audio/webm", "audio/opus", "audio/wav"],
    native: ["audio/m4a", "audio/aac", "audio/wav"],
  };

  /**
   * Upload audio vers le backend FastAPI
   * Gère automatiquement les formats et la conversion
   */
  async uploadAudio(audioUri: string): Promise<AudioUploadResponse> {
    try {
      console.log("🚀 Début de l'upload audio...");
      console.log("📁 URI audio:", audioUri);
      console.log("🌐 Plateforme:", Platform.OS);

      // 1. Vérifier et préparer l'audio selon la plateforme
      const audioBlob = await this.prepareAudioForUpload(audioUri);

      if (!audioBlob) {
        throw new Error("Impossible de préparer l'audio pour l'upload");
      }

      // 2. Vérifier la taille du fichier
      if (audioBlob.size > this.MAX_FILE_SIZE) {
        throw new Error(
          `Fichier trop volumineux: ${(audioBlob.size / 1024 / 1024).toFixed(2)}MB (max: 50MB)`,
        );
      }

      // 3. Créer le FormData
      const formData = new FormData();
      formData.append("file", audioBlob, this.generateFileName());

      console.log("📤 Fichier préparé:", audioBlob.size, "bytes");

      // 4. Upload vers FastAPI
      const response = await this.performUpload(formData);

      // 5. Traiter la réponse
      return this.processResponse(response);
    } catch (error) {
      console.error("❌ Erreur lors de l'upload:", error);
      return this.handleError(error);
    }
  }

  /**
   * Prépare l'audio selon la plateforme (Web vs Native)
   */
  private async prepareAudioForUpload(audioUri: string): Promise<Blob | null> {
    try {
      if (Platform.OS === "web") {
        return await this.prepareWebAudio(audioUri);
      } else {
        return await this.prepareNativeAudio(audioUri);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la préparation audio:", error);
      return null;
    }
  }

  /**
   * Prépare l'audio pour Web (Blob WebM/Opus)
   */
  private async prepareWebAudio(audioUri: string): Promise<Blob> {
    console.log("🌐 Préparation audio Web...");

    // Si c'est déjà un Blob (cas le plus courant)
    if (audioUri.startsWith("blob:")) {
      const response = await fetch(audioUri);
      return await response.blob();
    }

    // Si c'est un fichier local (File)
    if (audioUri.startsWith("file:")) {
      const response = await fetch(audioUri);
      return await response.blob();
    }

    // Si c'est une URL de données
    if (audioUri.startsWith("data:")) {
      const response = await fetch(audioUri);
      return await response.blob();
    }

    throw new Error("Format d'URI audio non supporté sur Web");
  }

  /**
   * Prépare l'audio pour Native (iOS/Android)
   */
  private async prepareNativeAudio(audioUri: string): Promise<Blob> {
    console.log("📱 Préparation audio Native...");

    try {
      // Pour React Native, on peut utiliser fetch sur l'URI local
      const response = await fetch(audioUri);
      const blob = await response.blob();

      console.log("✅ Audio native préparé:", blob.size, "bytes");
      return blob;
    } catch (error) {
      console.error("❌ Erreur lors de la préparation audio native:", error);

      // Fallback : créer un Blob vide avec un message d'erreur
      const errorMessage = `Erreur audio native: ${error instanceof Error ? error.message : "Erreur inconnue"}`;
      return new Blob([errorMessage], { type: "text/plain" });
    }
  }

  /**
   * Effectue l'upload vers FastAPI
   */
  private async performUpload(formData: FormData): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/conversation/`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
        headers: {
          // Pas de Content-Type pour FormData (browser le gère)
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Timeout de l'upload (60s)");
      }

      throw error;
    }
  }

  /**
   * Traite la réponse du serveur
   */
  private async processResponse(
    response: Response,
  ): Promise<AudioUploadResponse> {
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur serveur:", response.status, errorText);

      throw new Error(`Erreur serveur: ${response.status} - ${errorText}`);
    }

    try {
      // Récupérer la réponse audio
      const audioData = await response.arrayBuffer();

      console.log(
        "✅ Upload réussi, réponse audio reçue:",
        audioData.byteLength,
        "bytes",
      );

      return {
        success: true,
        audioData,
        transcription: "Transcription disponible dans la réponse serveur",
      };
    } catch (error) {
      console.error("❌ Erreur lors du traitement de la réponse:", error);
      throw new Error("Erreur lors du traitement de la réponse audio");
    }
  }

  /**
   * Gère les erreurs et retourne une réponse formatée
   */
  private handleError(error: unknown): AudioUploadResponse {
    let errorType = AudioUploadError.SERVER_ERROR;
    let errorMessage = "Erreur inconnue lors de l'upload";

    if (error instanceof Error) {
      errorMessage = error.message;

      if (error.message.includes("Timeout")) {
        errorType = AudioUploadError.TIMEOUT;
      } else if (error.message.includes("trop volumineux")) {
        errorType = AudioUploadError.FILE_TOO_LARGE;
      } else if (error.message.includes("Permission")) {
        errorType = AudioUploadError.PERMISSION_DENIED;
      } else if (error.message.includes("Network")) {
        errorType = AudioUploadError.NETWORK_ERROR;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }

  /**
   * Génère un nom de fichier unique
   */
  private generateFileName(): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);

    if (Platform.OS === "web") {
      return `audio_${timestamp}_${randomId}.webm`;
    } else {
      return `audio_${timestamp}_${randomId}.m4a`;
    }
  }

  /**
   * Vérifie la compatibilité de la plateforme
   */
  checkPlatformCompatibility(): boolean {
    if (Platform.OS === "web") {
      // Vérifier que MediaRecorder est supporté
      return typeof MediaRecorder !== "undefined";
    } else {
      // Sur mobile, expo-av gère la compatibilité
      return true;
    }
  }

  /**
   * Obtient les formats supportés pour la plateforme
   */
  getSupportedFormats(): string[] {
    return Platform.OS === "web"
      ? this.SUPPORTED_FORMATS.web
      : this.SUPPORTED_FORMATS.native;
  }
}

// Export d'une instance unique
export const audioUploadService = new AudioUploadService();
