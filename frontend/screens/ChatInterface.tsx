import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Platform, TextInput, KeyboardAvoidingView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { AudioRecorder } from "../components/common/AudioRecorder";
import { GradientBackground } from "../components/common/GradientBackground";
import { colors, typography, spacing, dimensions, shadows } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { API_URLS } from "../constants/api";
import { ApiService } from "../services/api";

interface Message {
  id: string;
  type: "user" | "sana";
  content: string;
  timestamp: Date;
  audioUri?: string;
}

interface ChatInterfaceProps {
  onClose: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const { user } = useAuth();
  const username = user?.username || "demo";

 
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleRecordingStart = () => {
    console.log(" Enregistrement démarré");
    setIsRecording(true);
  };

  const handleRecordingStop = () => {
    console.log(" Enregistrement arrêté");
    setIsRecording(false);
  };

  const handleAudioReady = async (audioUri: string) => {
    console.log("🎵 Audio prêt:", audioUri);
    setIsProcessing(true);

    try {
     
      const tempUserMsg: Message = {
        id: `${Date.now()}`,
        type: "user",
        content: "Message vocal",
        timestamp: new Date(),
        audioUri,
      };
      setMessages((prev) => [...prev, tempUserMsg]);

      // Envoyer l'audio au backend
      const formData = new FormData();
      formData.append("file", {
        uri: audioUri,
        type: "audio/m4a",
        
        name: `${username}.m4a`,
      } as any);
     
      const response = await fetch(API_URLS.CONVERSATION, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          // Réponse texte
          const textResponse = await response.json();

          const sanaMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "sana",
            content: textResponse.text,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, sanaMessage]);
  } else {
          // Réponse audio
          const audioBlob = await response.blob();

          if (audioBlob.size > 0) {
            let audioUriForMsg = "";
            if (Platform.OS === "web") {
              audioUriForMsg = URL.createObjectURL(audioBlob);
            } else {
              const reader = new FileReader();
              audioUriForMsg = await new Promise<string>((resolve, reject) => {
                reader.onloadend = async () => {
                  try {
                    const dataUrl = reader.result as string;
                    const base64 = dataUrl.split(",")[1];
                    const fileUri = `${FileSystem.cacheDirectory}sana-reply.m4a`;
                    await FileSystem.writeAsStringAsync(fileUri, base64, {
                      encoding: FileSystem.EncodingType.Base64,
                    });
                    resolve(fileUri);
                  } catch (e) {
                    reject(e);
                  }
                };
                reader.onerror = reject;
                reader.readAsDataURL(audioBlob);
              });
            }

            // Essayer de lire le texte renvoyé dans les en-têtes
            const replyHeader = response.headers.get("X-Reply-Text") || "Réponse audio de Sana";
            const sanaMessage: Message = {
              id: (Date.now() + 1).toString(),
              type: "sana",
              content: replyHeader,
              timestamp: new Date(),
              audioUri: audioUriForMsg,
            };
            setMessages((prev) => [...prev, sanaMessage]);

            // Jouer automatiquement la réponse de Sana
            await playAudio(audioUriForMsg);

            if (Platform.OS === "web") {
              URL.revokeObjectURL(audioUriForMsg);
            }
          }
        }
      }
    } catch (error) {
      console.error("❌ Erreur envoi audio:", error);

      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "sana",
        content:
          "Désolé, je n'ai pas pu traiter votre message. Veuillez réessayer.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Envoi d'un message texte (endpoint backend JSON)
  const handleSendText = async () => {
    const content = textInput.trim();
    if (!content) return;
    const userMsg: Message = {
      id: `${Date.now()}`,
      type: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setTextInput("");

    try {
      setIsProcessing(true);
      const { reply } = await ApiService.textConversation({
        username,
        message: content,
      });

      const sanaMsg: Message = {
        id: `${Date.now() + 1}`,
        type: "sana",
        content: reply || "",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, sanaMsg]);
    } catch (e: any) {
      const errMsg: Message = {
        id: `${Date.now() + 2}`,
        type: "sana",
        content: "Désolé, l'envoi du message texte a échoué.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (error: string) => {
    console.error("❌ Erreur:", error);
    setIsRecording(false);
    setIsProcessing(false);
  };

  const playAudio = async (audioUri: string) => {
    try {
      console.log("🔊 Lecture audio:", audioUri);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        ...(Platform.OS === "android"
          ? {
              shouldDuckAndroid: false,
              playThroughEarpieceAndroid: false,
            }
          : {}),
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: false, isMuted: false, volume: 1.0 },
      );
      await sound.setIsMutedAsync(false);
      await sound.setVolumeAsync(1.0);
      await sound.playAsync();

      await new Promise((resolve) => {
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            resolve(true);
          }
        });
      });

      await sound.unloadAsync();
      console.log("✅ Lecture audio terminée");
    } catch (error) {
      console.error("❌ Erreur lecture audio:", error);
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.type === "user";

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.sanaMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.sanaBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.sanaText,
            ]}
          >
            {message.content}
          </Text>

          {message.audioUri && (
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => playAudio(message.audioUri!)}
            >
              <Ionicons
                name="play-circle"
                size={24}
                color={isUser ? colors.primary : colors.white}
              />
            </TouchableOpacity>
          )}

          <Text
            style={[
              styles.timestamp,
              isUser ? styles.userTimestamp : styles.sanaTimestamp,
            ]}
          >
            {message.timestamp.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <GradientBackground variant="main" style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={Platform.OS === "android"}
      />

      {/* Header avec le même style que HomeScreen */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onClose}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sana</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Zone messages + input contrôlée par le clavier */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 + dimensions.safeAreaTop : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Ionicons name="chatbubbles-outline" size={64} color={colors.textSecondary} />
              </View>
              <Text style={styles.emptyStateText}>Commencez une conversation avec Sana</Text>
              <Text style={styles.emptyStateSubtext}>Parlez ou écrivez votre message</Text>
            </View>
          ) : (
            messages.map(renderMessage)
          )}

          {isProcessing && (
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>Sana réfléchit...</Text>
            </View>
          )}
        </ScrollView>

        {/* Barre d'entrée texte + micro */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.micButton} onPress={() => { /* focus micro */ }}>
            <Ionicons name="mic" size={22} color={colors.white} />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Écrire à Sana..."
            placeholderTextColor={colors.textSecondary}
            value={textInput}
            onChangeText={setTextInput}
            onSubmitEditing={handleSendText}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendText} disabled={!textInput.trim()}>
            <Ionicons name="send" size={20} color={textInput.trim() ? colors.white : "#cbd5e1"} />
          </TouchableOpacity>
        </View>

        {/* Enregistreur audio (même style que HomeScreen) */}
        <View style={styles.recorderContainer}>
          <View style={styles.recorderWrapper}>
            <AudioRecorder
              onRecordingStart={handleRecordingStart}
              onRecordingStop={handleRecordingStop}
              onAudioReady={handleAudioReady}
              onError={handleError}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? dimensions.safeAreaTop + 10 : 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },
  headerTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weights.semiBold,
    color: colors.textPrimary,
  },
  placeholder: {
    width: 44,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  messagesContent: {
    paddingBottom: spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxxl,
  },
  emptyStateIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  emptyStateText: {
    fontSize: typography.h4,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
  messageContainer: {
    marginBottom: spacing.md,
  },
  userMessage: {
    alignItems: "flex-end",
  },
  sanaMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: spacing.md,
    borderRadius: 16,
    ...shadows.sm,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  sanaBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: typography.body,
    lineHeight: 20,
  },
  userText: {
    color: colors.white,
  },
  sanaText: {
    color: colors.textPrimary,
  },
  playButton: {
    marginTop: spacing.sm,
    alignSelf: "flex-start",
  },
  timestamp: {
    fontSize: typography.caption1,
    marginTop: spacing.xs,
  },
  userTimestamp: {
    color: colors.white,
    opacity: 0.8,
  },
  sanaTimestamp: {
    color: colors.textSecondary,
  },
  typingIndicator: {
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  typingText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  recorderContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: Platform.OS === "ios" ? spacing.lg + 20 : spacing.lg,
  },
  recorderWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    color: colors.textPrimary,
    ...shadows.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },
});
