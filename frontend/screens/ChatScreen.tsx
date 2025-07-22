import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { styles } from './css/ChatScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const { width, height } = Dimensions.get('window');

export default function ChatScreen({ navigation }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Bonjour ! Je suis SANA, votre assistant santé personnel. Comment puis-je vous aider aujourd'hui ?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const quickSuggestions = [
    "Comment puis-je améliorer mon sommeil ?",
    "Quels sont les symptômes à surveiller ?",
    "Conseils pour réduire le stress",
    "Alimentation équilibrée"
  ];
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const typingAnim1 = useRef(new Animated.Value(0.3)).current;
  const typingAnim2 = useRef(new Animated.Value(0.3)).current;
  const typingAnim3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // partie sur les animations du tchat 
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    
    const animateTyping = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim1, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim2, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim3, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim1, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim2, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim3, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    
    animateTyping();
  }, []);

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
    setShowSuggestions(false);
  };
  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);

    // partie test de Simuler une réponse de SANA 
    setTimeout(() => {
      const responses = [
        "Merci pour votre question ! 🩺 Je suis là pour vous accompagner dans votre parcours santé.",
        "Je comprends votre préoccupation. 💭 Pouvez-vous me donner plus de détails pour que je puisse mieux vous aider ?",
        "Excellente question ! 👍 Laissez-moi vous expliquer cela de manière simple et claire...",
        "Votre bien-être est ma priorité. 💚 Voici mes recommandations personnalisées pour vous :",
        "Je vais analyser votre situation. 🔍 Basé sur les informations que vous partagez, voici ce que je peux vous conseiller...",
        "C'est tout à fait normal de se poser cette question. 🤝 Ensemble, nous allons trouver les meilleures solutions.",
      ];      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);

    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        
        
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#4a90e2" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="medical" size={24} color="#ffffff" />
              </View>
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.titleInfo}>
              <Text style={styles.headerText}>SANA</Text>
              <Text style={styles.headerSubtext}>Assistant Santé • En ligne</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#7f8c8d" />
          </TouchableOpacity>
        </View>          <View style={styles.statusIndicator}>
            <View style={styles.onlineIndicator} />
          </View>
        </View>

        
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.isUser ? styles.userMessageWrapper : styles.assistantMessageWrapper,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.isUser ? styles.userMessageText : styles.assistantMessageText,
                  ]}
                >
                  {message.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    message.isUser ? styles.userMessageTime : styles.assistantMessageTime,
                  ]}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            </View>
          ))}

          {/* Indicateur de frappe que j'adore place ici */}
          {isTyping && (
            <View style={styles.typingContainer}>
              <View style={styles.typingBubble}>
                <View style={styles.typingIndicator}>
                  <Animated.View style={[styles.typingDot, { opacity: typingAnim1 }]} />
                  <Animated.View style={[styles.typingDot, { opacity: typingAnim2 }]} />
                  <Animated.View style={[styles.typingDot, { opacity: typingAnim3 }]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Suggestions rapides */}
        {showSuggestions && messages.length === 1 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Suggestions rapides :</Text>
            <View style={styles.suggestionsGrid}>
              {quickSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Ionicons name="chatbubble-outline" size={16} color="#4a90e2" />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Zone de saisie moderne */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="add-circle-outline" size={24} color="#7f8c8d" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Tapez votre message..."
              placeholderTextColor="#95a5a6"
              value={inputText}
              onChangeText={(text) => {
                setInputText(text);
                if (text.length > 0) setShowSuggestions(false);
              }}
              multiline
              maxLength={500}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive,
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={inputText.trim() ? "#ffffff" : "#bdc3c7"} 
              />
            </TouchableOpacity>
          </View>
        </View>        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
 
