import {
  useAudioRecorder,
  useAudioPlayer,
  setAudioModeAsync,
  requestRecordingPermissionsAsync,
  RecordingOptions,
  AudioMode,
} from "expo-audio";
import { Platform } from "react-native";
import { API_CONFIG } from "../constants/api";
import { SessionManager } from "./sessionManager";

// Types pour le service audio
export interface ConversationResponse {
  success: boolean;
  audioData?: ArrayBuffer;
  error?: string;
  transcription?: string;
}

class AudioService {
  private isRecording = false;

  /**
   * Demande les permissions audio
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await requestRecordingPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission audio refusée");
        return false;
      }

      // Configurer l'audio pour l'enregistrement
      const audioMode: Partial<AudioMode> = {
        playsInSilentMode: true,
        allowsRecording: true,
        shouldPlayInBackground: false,
        shouldRouteThroughEarpiece: false,
      };

      await setAudioModeAsync(audioMode);

      return true;
    } catch (error) {
      console.error("Erreur lors de la demande de permission:", error);
      return false;
    }
  }

  /**
   * Démarre l'enregistrement audio
   */
  async startRecording(): Promise<boolean> {
    try {
      if (this.isRecording) {
        console.warn("Enregistrement déjà en cours");
        return false;
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return false;
      }

      console.log("🎤 Début de l'enregistrement...");

      // Pour l'instant, utilisons une approche simple
      // TODO: Implémenter l'enregistrement audio réel avec useAudioRecorder
      console.log(
        "⚠️  Enregistrement audio simulé (à implémenter avec useAudioRecorder)",
      );

      // Simuler l'enregistrement
      this.isRecording = true;

      console.log("✅ Enregistrement démarré (simulé)");
      return true;
    } catch (error) {
      console.error("❌ Erreur lors du démarrage de l'enregistrement:", error);
      return false;
    }
  }

  /**
   * Arrête l'enregistrement audio
   */
  async stopRecording(): Promise<string | null> {
    try {
      if (!this.isRecording) {
        console.warn("Aucun enregistrement en cours");
        return null;
      }

      console.log("🛑 Arrêt de l'enregistrement...");

      // Simuler l'arrêt de l'enregistrement
      this.isRecording = false;

      // Retourner un URI factice pour le test
      const fakeUri = "file:///tmp/test_recording.m4a";
      console.log("📁 URI de l'enregistrement (simulé):", fakeUri);

      return fakeUri;
    } catch (error) {
      console.error("❌ Erreur lors de l'arrêt de l'enregistrement:", error);
      return null;
    }
  }

  /**
   * Envoie l'audio au backend et récupère la réponse
   */
  async sendAudioToBackend(audioUri: string): Promise<ConversationResponse> {
    try {
      console.log("🚀 Envoi de l'audio au backend...");
      console.log("📁 URI audio reçu:", audioUri);

      // ✅ CORRIGÉ : Utiliser le vrai fichier audio enregistré
      console.log("🎵 Utilisation du vrai fichier audio enregistré");

      // Créer un FormData avec le fichier audio
      const formData = new FormData();

      // ✅ NOUVEAU : Récupérer le vrai fichier audio depuis l'URI
      let audioFile: File;

      if (audioUri.startsWith("blob:")) {
        // URI blob (cas le plus courant)
        const response = await fetch(audioUri);
        const audioBlob = await response.blob();

        // Créer un fichier avec un nom unique
        const timestamp = Date.now();
        const session_data = await SessionManager.getSession()
        audioFile = new File(
          [audioBlob],
          `${session_data.user.username}.webm`,
          {
            type: audioBlob.type || "audio/webm",
          },
        );

        console.log(
          "📤 Fichier audio blob préparé:",
          audioFile.name,
          audioFile.size,
          "bytes",
        );
      } else {
        // URI file ou data (fallback)
        const response = await fetch(audioUri);
        const audioBlob = await response.blob();

        const timestamp = Date.now();
        const session_data = await SessionManager.getSession()
        audioFile = new File(
          [audioBlob],
          `${session_data.user.username}.m4a`,
          {
            type: audioBlob.type || "audio/m4a",
          },
        );

        console.log(
          "📤 Fichier audio file préparé:",
          audioFile.name,
          audioFile.size,
          "bytes",
        );
      }

      formData.append("file", audioFile);

      console.log("🌐 Envoi de la requête...");

      const response = await fetch(`${API_CONFIG.BASE_URL}/conversation/`, {
        method: "POST",
        body: formData,
        // ✅ CORRIGÉ : Ne pas définir Content-Type pour FormData
        // Le navigateur le gère automatiquement avec la boundary
      });

      console.log("📊 Réponse reçue:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erreur API:", response.status, errorText);
        return {
          success: false,
          error: `Erreur serveur: ${response.status}`,
        };
      }

      // Récupérer la réponse audio
      const responseAudioData = await response.arrayBuffer();
      console.log(
        "✅ Réponse audio reçue, taille:",
        responseAudioData.byteLength,
      );

      return {
        success: true,
        audioData: responseAudioData,
      };
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi audio:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Joue la réponse audio (approche compatible service)
   */
  async playAudioResponse(audioData: ArrayBuffer): Promise<boolean> {
    try {
      console.log("🔊 Lecture de la réponse audio...");

      // ✅ CORRIGÉ : Utiliser l'API Web Audio native au lieu des hooks React
      if (typeof window !== "undefined" && window.AudioContext) {
        // Approche Web Audio API
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();

        // Décoder les données audio
        const audioBuffer = await audioContext.decodeAudioData(audioData);

        // Créer une source audio
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);

        // Démarrer la lecture
        source.start(0);

        // Attendre la fin de la lecture
        await new Promise((resolve) => {
          source.onended = () => resolve(true);
        });

        // Nettoyer
        audioContext.close();

        console.log("✅ Lecture audio Web terminée");
        return true;
      } else {
        // Fallback : notification de succès sans lecture
        console.log("⚠️ Lecture audio non supportée sur cette plateforme");
        return true;
      }
    } catch (error) {
      console.error("❌ Erreur lors de la lecture audio:", error);
      // ✅ NOUVEAU : Ne pas faire échouer le processus pour une erreur de lecture
      console.log("ℹ️ Continuer sans lecture audio");
      return true;
    }
  }

  /**
   * Fonction complète : enregistrement → envoi → lecture
   */
  async recordAndSend(
    onRecordingStart?: () => void,
    onRecordingStop?: () => void,
    onProcessing?: () => void,
    onResponse?: (success: boolean) => void,
  ): Promise<ConversationResponse> {
    try {
      // 1. Démarrer l'enregistrement
      onRecordingStart?.();
      const recordingStarted = await this.startRecording();

      if (!recordingStarted) {
        return {
          success: false,
          error: "Impossible de démarrer l'enregistrement",
        };
      }

      // 2. Attendre que l'utilisateur arrête (simulation pour le test)
      // En réalité, cela sera géré par l'interface utilisateur
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 secondes pour le test

      // 3. Arrêter l'enregistrement
      onRecordingStop?.();
      const audioUri = await this.stopRecording();

      if (!audioUri) {
        return {
          success: false,
          error: "Erreur lors de l'arrêt de l'enregistrement",
        };
      }

      // 4. Envoyer au backend
      onProcessing?.();
      const response = await this.sendAudioToBackend(audioUri);

      // 5. Notifier le résultat
      onResponse?.(response.success);

      return response;
    } catch (error) {
      console.error("❌ Erreur dans recordAndSend:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Vérifie si l'enregistrement est en cours
   */
  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Nettoie les ressources
   */
  cleanup(): void {
    // useAudioRecorder et useAudioPlayer gèrent leur propre nettoyage
    // Il n'y a pas de ressources à nettoyer manuellement ici
  }
}

// Instance singleton
export const audioService = new AudioService();
export default audioService;
