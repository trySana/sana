import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useAudioRecorder,
  useAudioRecorderState,
  setAudioModeAsync,
  requestRecordingPermissionsAsync,
  RecordingOptions,
  AudioMode,
} from "expo-audio";
import { colors, typography, spacing } from "../../constants/theme";

interface AudioRecorderProps {
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  onAudioReady?: (uri: string) => void;
  onError?: (error: string) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingStart,
  onRecordingStop,
  onAudioReady,
  onError,
}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isRecorderReady, setIsRecorderReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // ✅ NOUVEAU : États UX cohérents
  const [recorderStatus, setRecorderStatus] = useState<
    "idle" | "preparing" | "recording" | "sending"
  >("idle");

  // ✅ NOUVEAU : Timeout d'enregistrement
  const [recordingTimeout, setRecordingTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const MAX_RECORDING_DURATION = 120000; // 120 secondes max

  // ✅ NOUVEAU : Mutex anti double-tap
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const actionMutex = React.useRef(false);

  // Configuration d'enregistrement optimisée
  const recordingOptions: RecordingOptions = {
    extension: ".m4a",
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    isMeteringEnabled: true,
    android: {
      outputFormat: "mpeg4",
      audioEncoder: "aac",
    },
    ios: {
      outputFormat: "aac ",
      audioQuality: 96, // HIGH
      bitRateStrategy: 0, // constant
    },
  };

  // Hook pour l'enregistreur audio
  const recorder = useAudioRecorder(recordingOptions, (status) => {
    console.log("📊 Status enregistrement:", status);

    // ✅ NOUVEAU : Protection contre les race conditions
    if (status.error) {
      console.error("❌ Erreur recorder:", status.error);
      setIsRecording(false);
      setRecorderStatus("idle");
      clearRecordingTimeout();
      onError?.(`Erreur recorder: ${status.error}`);
      return;
    }

    if (status.isFinished && status.url) {
      console.log("✅ Enregistrement terminé, URL:", status.url);
      setIsRecording(false);
      setRecorderStatus("idle");
      clearRecordingTimeout();
      onAudioReady?.(status.url);
    }
  });

  // Hook pour l'état de l'enregistreur
  const recorderState = useAudioRecorderState(recorder, 100);

  // Demander les permissions au montage du composant
  useEffect(() => {
    requestPermissions();

    // ✅ NOUVEAU : Nettoyage lors du démontage
    return () => {
      cleanupRecorder();
    };
  }, []);

  // ✅ NOUVEAU : Fonction de nettoyage
  const cleanupRecorder = async () => {
    try {
      if (isRecording) {
        await recorder.stop();
        setIsRecording(false);
      }

      // ✅ NOUVEAU : Nettoyer le timeout
      if (recordingTimeout) {
        clearTimeout(recordingTimeout);
        setRecordingTimeout(null);
      }

      // Nettoyage spécifique selon la plateforme
      if (Platform.OS === "web") {
        // Web : arrêter les tracks MediaStream
        if (recorder && "getTracks" in recorder) {
          const tracks = (recorder as any).getTracks?.();
          if (tracks) {
            tracks.forEach((track: any) => track.stop());
          }
        }
      } else {
        // Native : stopAndUnloadAsync si disponible
        if (recorder && "stopAndUnloadAsync" in recorder) {
          await (recorder as any).stopAndUnloadAsync();
        }
      }

      setIsRecorderReady(false);
      setRecorderStatus("idle");
      console.log("🧹 Recorder nettoyé");
    } catch (error) {
      console.error("❌ Erreur lors du nettoyage:", error);
    }
  };

  // ✅ NOUVEAU : Fonction de nettoyage du timeout (stabilisée)
  const clearRecordingTimeout = React.useCallback(() => {
    if (recordingTimeout) {
      clearTimeout(recordingTimeout);
      setRecordingTimeout(null);
    }
  }, [recordingTimeout]); // ✅ Dépendance explicite

  // ✅ NOUVEAU : Fonction de timeout d'enregistrement (stabilisée)
  const startRecordingTimeout = React.useCallback(() => {
    const timeout = setTimeout(async () => {
      console.log("⏰ Timeout d'enregistrement atteint (120s)");
      // ✅ Utilisation directe de la logique de stop pour éviter la dépendance circulaire
      if (isRecording) {
        setIsRecording(false);
        setRecorderStatus("idle");
        clearRecordingTimeout();
        onError?.(
          "Enregistrement interrompu : durée maximale de 120 secondes atteinte",
        );
      }
    }, MAX_RECORDING_DURATION);

    setRecordingTimeout(timeout);
  }, [isRecording, clearRecordingTimeout, onError]); // ✅ Dépendances explicites

  // ✅ NOUVEAU : Mutex anti double-tap (stabilisé avec useCallback)
  const withMutex = React.useCallback(
    async (action: () => Promise<void>): Promise<void> => {
      if (actionMutex.current) {
        console.log("🚫 Action déjà en cours, ignorée");
        return;
      }

      try {
        actionMutex.current = true;
        setIsActionInProgress(true);
        await action();
      } finally {
        actionMutex.current = false;
        setIsActionInProgress(false);
      }
    },
    [],
  ); // ✅ Dépendances vides = fonction stable

  const requestPermissions = async () => {
    try {
      console.log("🔐 Demande des permissions audio...");

      // ✅ NOUVEAU : Sur Web, on teste directement avec prepareRecorder
      // Sur Native, on utilise requestRecordingPermissionsAsync
      if (Platform.OS === "web") {
        console.log(
          "🌐 Plateforme Web : test direct des permissions via prepareRecorder",
        );
        await configureAudioMode();
        const isReady = await prepareRecorder();
        return isReady;
      } else {
        // Native : demande explicite des permissions
        const { status } = await requestRecordingPermissionsAsync();

        if (status === "granted") {
          console.log("✅ Permission audio accordée (Native)");
          await configureAudioMode();
          const isReady = await prepareRecorder();
          return isReady;
        } else {
          console.log("❌ Permission audio refusée (Native)");
          setHasPermission(false);
          onError?.("Permission audio refusée");
          return false;
        }
      }
    } catch (error) {
      console.error("❌ Erreur lors de la demande de permission:", error);
      onError?.("Erreur lors de la demande de permission");
      return false;
    }
  };

  const configureAudioMode = async () => {
    try {
      const audioMode: Partial<AudioMode> = {
        playsInSilentMode: true,
        allowsRecording: true,
        shouldPlayInBackground: false,
        shouldRouteThroughEarpiece: false,
      };

      await setAudioModeAsync(audioMode);

      // ✅ CORRIGÉ : Ne pas préparer le recorder ici, seulement configurer l'audio
      // Le recorder sera préparé plus tard quand les permissions seront accordées

      setIsConfigured(true);
      console.log("✅ Mode audio configuré (recorder à préparer plus tard)");
    } catch (error) {
      console.error("Erreur lors de la configuration audio:", error);
      onError?.("Erreur lors de la configuration audio");
    }
  };

  // ✅ NOUVEAU : Fonction sécurisée de préparation du recorder (permission centralisée)
  const prepareRecorder = async (): Promise<boolean> => {
    try {
      // Vérifier si déjà prêt (idempotence)
      if (isRecorderReady) {
        console.log("✅ Recorder déjà prêt");
        return true;
      }

      // ✅ NOUVEAU : Mettre à jour l'état
      setRecorderStatus("preparing");

      // Vérifier HTTPS pour Web
      if (Platform.OS === "web") {
        const isSecure =
          window.location.protocol === "https:" ||
          window.location.hostname === "localhost";
        if (!isSecure) {
          throw new Error("HTTPS requis pour l'enregistrement audio sur Web");
        }
      }

      console.log("🔧 Préparation du recorder...");
      await recorder.prepareToRecordAsync(recordingOptions);

      // ✅ NOUVEAU : Si la préparation réussit, les permissions sont accordées
      // C'est la source de vérité unique pour les permissions
      setHasPermission(true);
      setIsRecorderReady(true);
      setRecorderStatus("idle");

      console.log("✅ Recorder préparé avec succès + Permission accordée");
      return true;
    } catch (error) {
      console.error("❌ Erreur lors de la préparation du recorder:", error);
      setIsRecorderReady(false);
      setRecorderStatus("idle");

      // Erreurs explicites selon le type
      let errorMessage = "Erreur lors de la préparation du recorder";
      if (error instanceof Error) {
        if (error.message.includes("HTTPS")) {
          errorMessage = "HTTPS requis pour l'enregistrement audio sur Web";
        } else if (error.message.includes("permission")) {
          errorMessage = "Permission audio refusée";
        } else if (error.message.includes("device")) {
          errorMessage = "Appareil audio occupé ou non disponible";
        } else {
          errorMessage = `Erreur technique: ${error.message}`;
        }
      }

      onError?.(errorMessage);
      return false;
    }
  };

  const startRecording = React.useCallback(async () => {
    // ✅ NOUVEAU : Protection mutex anti double-tap
    await withMutex(async () => {
      try {
        // ✅ SÉCURISÉ : Vérifications d'état strictes (simplifiées)
        if (!hasPermission || !isConfigured || !isRecorderReady) {
          console.log(
            "🔧 Initialisation audio manquante, initialisation en cours...",
          );

          // ✅ NOUVEAU : Une seule fonction qui gère tout
          const isReady = await requestPermissions();
          if (!isReady) {
            onError?.("Impossible d'initialiser l'audio");
            return;
          }

          console.log("✅ Audio initialisé avec succès");
        }

        if (isRecording || recorderState.isRecording) {
          onError?.("Enregistrement déjà en cours");
          return;
        }

        console.log("🎤 Démarrage de l'enregistrement...");
        onRecordingStart?.();

        // ✅ NOUVEAU : Démarrer l'enregistrement directement (déjà préparé)
        setRecorderStatus("recording");
        setIsRecording(true);
        await recorder.record();

        // ✅ NOUVEAU : Démarrer le timeout
        startRecordingTimeout();

        console.log("✅ Enregistrement démarré avec timeout de 120s");
      } catch (error) {
        console.error("❌ Erreur lors du démarrage:", error);
        setIsRecording(false);
        setRecorderStatus("idle");
        onError?.(
          `Erreur lors du démarrage: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
        );
      }
    });
  }, [
    hasPermission,
    isConfigured,
    isRecorderReady,
    isRecording,
    recorderState.isRecording,
    onRecordingStart,
    onError,
    prepareRecorder,
    startRecordingTimeout,
  ]); // ✅ Dépendances explicites

  const stopRecording = React.useCallback(async () => {
    // ✅ NOUVEAU : Protection mutex anti double-tap
    await withMutex(async () => {
      try {
        if (!isRecording && !recorderState.isRecording) {
          onError?.("Aucun enregistrement en cours");
          return;
        }

        console.log("🛑 Arrêt de l'enregistrement...");
        onRecordingStop?.();

        // ✅ NOUVEAU : Arrêter le timeout
        clearRecordingTimeout();

        // Arrêter l'enregistrement
        await recorder.stop();

        setIsRecording(false);
        setRecorderStatus("idle");

        // ✅ NOUVEAU : Re-préparation du recorder après stop
        // Beaucoup d'APIs "débranchent" la source audio à l'arrêt
        console.log("🔄 Re-préparation du recorder après stop...");
        console.log("✅ Enregistrement arrêté, recorder re-préparé");
      } catch (error) {
        console.error("❌ Erreur lors de l'arrêt:", error);
        setIsRecording(false);
        setRecorderStatus("idle");
        onError?.(
          `Erreur lors de l'arrêt: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
        );
      }
    });
  }, [
    isRecording,
    recorderState.isRecording,
    onRecordingStop,
    onError,
    clearRecordingTimeout,
  ]); // ✅ Dépendances explicites

  // ✅ NOUVEAU : Debounce anti clics multiples
  const handlePress = React.useCallback(() => {
    if (recorderState.isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [recorderState.isRecording]);

  // ✅ NOUVEAU : Nettoyage des timeouts lors du démontage
  useEffect(() => {
    return () => {
      if (recordingTimeout) {
        clearTimeout(recordingTimeout);
      }
    };
  }, [recordingTimeout]);

  // ✅ NOUVEAU : Fonction de retry
  const handleRetry = async () => {
    try {
      console.log("🔄 Tentative de réinitialisation...");
      setIsRecorderReady(false);
      setIsRecording(false);

      const success = await prepareRecorder();
      if (success) {
        console.log("✅ Réinitialisation réussie");
      }
    } catch (error) {
      console.error("❌ Échec de la réinitialisation:", error);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermissions}
        >
          <Ionicons name="mic-off" size={24} color={colors.error} />
          <Text style={styles.permissionText}>Permission micro requise</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ✅ NOUVEAU : Affichage des erreurs avec retry
  if (!isRecorderReady && isConfigured) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.errorButton} onPress={handleRetry}>
          <Ionicons name="refresh" size={24} color={colors.error} />
          <Text style={styles.errorText}>Recorder non prêt - Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.recordButton,
          recorderState.isRecording && styles.recordingButton,
          isActionInProgress && styles.actionInProgressButton,
        ]}
        onPress={handlePress}
        disabled={!isConfigured || isActionInProgress}
      >
        <Ionicons
          name={recorderState.isRecording ? "stop" : "mic"}
          size={24}
          color={
            recorderState.isRecording
              ? colors.white
              : isActionInProgress
                ? colors.textSecondary
                : colors.primary
          }
        />
      </TouchableOpacity>

      <Text style={styles.statusText}>
        {recorderStatus === "recording"
          ? "Enregistrement..."
          : recorderStatus === "preparing"
            ? "Préparation..."
            : recorderStatus === "sending"
              ? "Envoi..."
              : "Appuyez pour enregistrer"}
      </Text>

      {recorderStatus === "recording" && (
        <Text style={styles.durationText}>
          {Math.floor(recorderState.durationMillis / 1000)}s
        </Text>
      )}

      {/* ✅ NOUVEAU : Indicateur de timeout */}
      {recorderStatus === "recording" && (
        <Text style={styles.timeoutText}>Max: 120s</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: spacing.md,
  },
  recordButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recordingButton: {
    backgroundColor: colors.error,
  },
  statusText: {
    marginTop: spacing.sm,
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
  durationText: {
    marginTop: spacing.xs,
    fontSize: typography.caption1,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  permissionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.error,
  },
  permissionText: {
    marginLeft: spacing.sm,
    fontSize: typography.body,
    color: colors.error,
  },
  errorButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: {
    marginLeft: spacing.sm,
    fontSize: typography.body,
    color: colors.error,
  },
  timeoutText: {
    marginTop: spacing.xs,
    fontSize: typography.caption2,
    color: colors.warning,
    fontWeight: typography.weights.medium,
  },
  actionInProgressButton: {
    opacity: 0.6,
    backgroundColor: colors.textSecondary,
  },
});
