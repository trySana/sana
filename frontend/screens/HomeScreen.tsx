import { View, Text, TouchableOpacity, Animated, Dimensions, PanResponder } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './css/HomeScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const { width, height } = Dimensions.get('window');

// Composant du Logo !!! avec mes petites animations maison BG
const SanaLogoModern = ({ 
  pulseAnim, 
  isListening, 
  onPress 
}: { 
  pulseAnim: Animated.Value; 
  isListening: boolean; 
  onPress: () => void; 
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.8}
      style={styles.logoTouchable}
    >
      <Animated.View style={[
        styles.logoContainer,
        {
          transform: [{ scale: pulseAnim }]
        }
      ]}>
        
        <Animated.View style={[
          styles.softGlow,
          {
            opacity: pulseAnim.interpolate({
              inputRange: [1, 1.1],
              outputRange: [0.3, 0.6],
            }),
            backgroundColor: isListening ? '#e74c3c' : '#e8f4fd',
          }
        ]} />
        
        <View style={styles.backgroundCircle} />
        
        <View style={[
          styles.modernCross,
          { backgroundColor: isListening ? '#fff8f8' : '#ffffff' }
        ]}>
          <View style={[
            styles.crossVertical,
            { backgroundColor: isListening ? '#e74c3c' : '#2ecc71' }
          ]} />
          <View style={[
            styles.crossHorizontal,
            { backgroundColor: isListening ? '#e74c3c' : '#2ecc71' }
          ]} />
          
          
          <View style={[
            styles.decorativeDot, 
            { 
              top: 15, 
              left: '50%', 
              marginLeft: -2,
              backgroundColor: isListening ? '#e74c3c' : '#4a90e2',
              opacity: isListening ? 1 : 0.7
            }
          ]} />
          <View style={[
            styles.decorativeDot, 
            { 
              bottom: 15, 
              left: '50%', 
              marginLeft: -2,
              backgroundColor: isListening ? '#e74c3c' : '#4a90e2',
              opacity: isListening ? 1 : 0.7
            }
          ]} />
          <View style={[
            styles.decorativeDot, 
            { 
              left: 15, 
              top: '50%', 
              marginTop: -2,
              backgroundColor: isListening ? '#e74c3c' : '#4a90e2',
              opacity: isListening ? 1 : 0.7
            }
          ]} />
          <View style={[
            styles.decorativeDot, 
            { 
              right: 15, 
              top: '50%', 
              marginTop: -2,
              backgroundColor: isListening ? '#e74c3c' : '#4a90e2',
              opacity: isListening ? 1 : 0.7
            }
          ]} />
        </View>
        
        <View style={[
          styles.elegantRing,
          { borderColor: isListening ? '#f8d7da' : '#d6ebf7' }
        ]} />
        
        {/* // test de l'indicateur d'écoute à re travailler */}
        {isListening && (
          <View style={styles.listeningIndicator}>
            <Text style={styles.listeningText}>🎤</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

// Composant du  Slide en test également
const SlideToUnlock = ({ onUnlock, resetTrigger }: { onUnlock: () => void; resetTrigger: boolean }) => {
  const [isSliding, setIsSliding] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const maxSlideDistance = width * 0.6; // Petite note pour regler la distance de glissement si jamais 
  const unlockThreshold = maxSlideDistance * 0.8; // 80% de la distance pour débloquer

  // Et test du Reset du slide quand resetTrigger change
  useEffect(() => {
    if (resetTrigger) {
      setIsUnlocked(false);
      setIsSliding(false);
      slideAnim.setValue(0);
    }
  }, [resetTrigger]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !isUnlocked,
    onMoveShouldSetPanResponder: () => !isUnlocked,
    
    onPanResponderGrant: () => {
      setIsSliding(true);
    },
    
    onPanResponderMove: (_, gestureState) => {
      
      const newValue = Math.max(0, Math.min(gestureState.dx, maxSlideDistance));
      slideAnim.setValue(newValue);
    },
    // Mon code test pour les animations de fin de glissement genre déverrouillage réussi ou retour à la position initiale
    onPanResponderRelease: (_, gestureState) => {
      setIsSliding(false);
      
      if (gestureState.dx > unlockThreshold) {
        
        setIsUnlocked(true);
        
        
        Animated.timing(slideAnim, {
          toValue: maxSlideDistance,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
         
          setTimeout(() => {
            onUnlock();
          }, 300);
        });
      } else {
       
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  // Animation du texte qui disparaît progressivement que je trouve sympa 
  const textOpacity = slideAnim.interpolate({
    inputRange: [0, maxSlideDistance * 0.3],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.slideContainer}>
      <View style={styles.slideTrack}>
        <Animated.Text style={[styles.slideText, { opacity: textOpacity }]}>
          {isUnlocked 
            ? 'Déverrouillé ! Accès au dashboard...' 
            : isSliding 
              ? 'Continuez à glisser...' 
              : 'Glissez pour accéder au dashboard' // Changer le nom du dashboard je ne suis pas fan
          }
        </Animated.Text>
        
        
        <Animated.View
          style={[
            styles.slideThumb,
            {
              transform: [{ translateX: slideAnim }],
              backgroundColor: isUnlocked ? '#27ae60' : '#4a90e2',
            }
          ]}
          {...panResponder.panHandlers}
        >
          <Text style={styles.slideThumbIcon}>
            {isUnlocked ? '✓' : '→'}
          </Text>
        </Animated.View>
        
        
        <Animated.View
          style={[
            styles.progressIndicator,
            {
              width: slideAnim.interpolate({
                inputRange: [0, maxSlideDistance],
                outputRange: [0, maxSlideDistance + 50],
                extrapolate: 'clamp',
              }),
            }
          ]}
        />
      </View>
    </View>
  );
};

export default function HomeScreen({ navigation }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [isListening, setIsListening] = useState(false);
  const [resetSlide, setResetSlide] = useState(false);

  // Reset du slide quand on revient sur la page
  useFocusEffect(
    useCallback(() => {
      setResetSlide(true);
      
      setTimeout(() => setResetSlide(false), 100);
    }, [])
  );

  useEffect(() => {
    // Animation de pulsation du logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);
// Fonction pour gérer le clic sur le logo
  // et démarrer l'écoute vocale
  // et simuler une interaction vocale
  // et rediriger vers le chat après 5 secondes
  // et arrêter l'écoute manuellement si déjà en écoute
  const handleLogoPress = () => {
    if (!isListening) {
      
      setIsListening(true);
      console.log('Interaction vocale démarrée');
      
      
      setTimeout(() => {
        setIsListening(false);
        console.log('Interaction vocale terminée');
        
        
        setTimeout(() => {
          navigation.navigate('Chat');
        }, 1000);
      }, 5000);
    } else {
      
      setIsListening(false);
      console.log('Interaction vocale arrêtée manuellement');
    }
  };

  const handleSlideUnlock = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.content,
        {
          transform: [{ translateY: slideAnim }]
        }
      ]}>
        
        {/* Menu de navigation en haut */}
        <View style={styles.topMenu}>
          <TouchableOpacity 
            style={styles.chatButton}
            onPress={() => navigation.navigate('Chat')}
          >
            <Text style={styles.chatButtonText}>💬</Text>
          </TouchableOpacity>
        </View>
        
        {/* Section centrale avec logo cliquable */}
        <View style={styles.centerContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.appTitle}>SANA</Text>
            <Text style={styles.appSubtitle}>Votre assistant santé</Text>
          </View>
          
          <SanaLogoModern 
            pulseAnim={pulseAnim} 
            isListening={isListening}
            onPress={handleLogoPress}
          />
          
          {/* Instructions d'utilisation */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionTitle}>
              {isListening ? 'En écoute...' : 'Touchez le logo pour parler'}
            </Text>
            <Text style={styles.instructionSubtitle}>
              {isListening 
                ? 'Parlez maintenant, je vous écoute' 
                : 'Démarrez une conversation vocale instantanée'}
            </Text>
            {isListening && (
              <Text style={styles.listeningHint}>
                Touchez à nouveau pour arrêter
              </Text>
            )}
          </View>
        </View>

        {/* Slide to unlock pour accéder au dashboard */}
        <SlideToUnlock onUnlock={handleSlideUnlock} resetTrigger={resetSlide} />
      </Animated.View>
    </View>
  );
}
