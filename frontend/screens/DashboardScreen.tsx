import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { styles } from './css/DashboardScreen.styles';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

interface HealthRecord {
  id: string;
  date: string;
  type: 'consultation' | 'symptome' | 'question';
  title: string;
  summary: string;
}

interface DailyMetrics {
  mood: number; 
  energy: number; 
  stress: number; 
  sleep: number; 
}

interface LifestyleData {
  steps: number;
  water: number; 
  nutritionScore: number; 
}

export default function DashboardScreen({ navigation }: Props) {
  
  const [todayMetrics] = useState<DailyMetrics>({
    mood: 7,
    energy: 6,
    stress: 4,
    sleep: 7.5
  });

  // Données mode de vie
  const [lifestyleData] = useState<LifestyleData>({
    steps: 8450,
    water: 6,
    nutritionScore: 8
  });

  // Données historiques (7 derniers jours pour le graphique)
  const [weeklyData] = useState([
    { day: 'Lun', mood: 6, energy: 7, stress: 5 },
    { day: 'Mar', mood: 7, energy: 6, stress: 6 },
    { day: 'Mer', mood: 8, energy: 8, stress: 3 },
    { day: 'Jeu', mood: 5, energy: 5, stress: 7 },
    { day: 'Ven', mood: 9, energy: 9, stress: 2 },
    { day: 'Sam', mood: 8, energy: 7, stress: 3 },
    { day: 'Auj', mood: 7, energy: 6, stress: 4 },
  ]);

  const mockRecords: HealthRecord[] = [
    {
      id: '1',
      date: '2025-07-15',
      type: 'consultation',
      title: 'Consultation SANA',
      summary: 'Discussion sur les maux de tête récurrents et conseils pour améliorer le sommeil...'
    },
    {
      id: '2',
      date: '2025-07-14',
      type: 'symptome',
      title: 'Fatigue matinale',
      summary: 'Analyse des troubles du sommeil et recommandations personnalisées...'
    },
    {
      id: '3',
      date: '2025-07-13',
      type: 'question',
      title: 'Nutrition et énergie',
      summary: 'Conseils pour une alimentation équilibrée et boost d\'énergie naturel...'
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return '🩺';
      case 'symptome': return '🌡️';
      case 'question': return '❓';
      default: return '💬';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return '#4a90e2';
      case 'symptome': return '#e74c3c';
      case 'question': return '#2ecc71';
      default: return '#95a5a6';
    }
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    return '😔';
  };

  const getStressColor = (stress: number) => {
    if (stress <= 3) return '#2ecc71'; // Vert (faible)
    if (stress <= 6) return '#f39c12'; // Orange (moyen)
    return '#e74c3c'; // Rouge (élevé)
  };

  const renderMiniChart = () => {
    const maxValue = 10;
    const chartWidth = 250;
    const chartHeight = 80;
    
    return (
      <View style={styles.miniChart}>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4a90e2' }]} />
            <Text style={styles.legendText}>Humeur</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#2ecc71' }]} />
            <Text style={styles.legendText}>Énergie</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#e74c3c' }]} />
            <Text style={styles.legendText}>Stress</Text>
          </View>
        </View>
        
        <View style={styles.chartContainer}>
          {weeklyData.map((data, index) => (
            <View key={index} style={styles.chartDay}>
              <View style={styles.chartBars}>
                <View 
                  style={[
                    styles.chartBar, 
                    { 
                      height: (data.mood / maxValue) * chartHeight,
                      backgroundColor: '#4a90e2',
                      marginRight: 1
                    }
                  ]} 
                />
                <View 
                  style={[
                    styles.chartBar, 
                    { 
                      height: (data.energy / maxValue) * chartHeight,
                      backgroundColor: '#2ecc71',
                      marginRight: 1
                    }
                  ]} 
                />
                <View 
                  style={[
                    styles.chartBar, 
                    { 
                      height: (data.stress / maxValue) * chartHeight,
                      backgroundColor: '#e74c3c'
                    }
                  ]} 
                />
              </View>
              <Text style={styles.chartDayLabel}>{data.day}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header moderne */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#4a90e2" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>Mon Dashboard</Text>
          <Text style={styles.headerSubtext}>Vue d'ensemble santé</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#4a90e2" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Section Actions Rapides */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.primaryActionButton}
            onPress={() => navigation.navigate('Chat')}
          >
            <Ionicons name="chatbubble-ellipses" size={24} color="#ffffff" />
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonTitle}>Parler à SANA</Text>
              <Text style={styles.actionButtonSubtitle}>Posez vos questions santé</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
          
          <View style={styles.secondaryActionsRow}>
            <TouchableOpacity style={styles.secondaryActionButton}>
              <Ionicons name="fitness-outline" size={22} color="#2ecc71" />
              <Text style={styles.secondaryActionText}>Exercices</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryActionButton}>
              <Ionicons name="restaurant-outline" size={22} color="#f39c12" />
              <Text style={styles.secondaryActionText}>Nutrition</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryActionButton}>
              <Ionicons name="moon-outline" size={22} color="#6c63ff" />
              <Text style={styles.secondaryActionText}>Sommeil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Widget Prochain RDV */}
        <View style={styles.appointmentWidget}>
          <View style={styles.widgetHeader}>
            <Ionicons name="calendar-outline" size={20} color="#4a90e2" />
            <Text style={styles.widgetTitle}>Prochain RDV</Text>
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentDate}>Mercredi 24 Juillet</Text>
            <Text style={styles.appointmentDetails}>Dr. Martin - Médecin généraliste</Text>
            <Text style={styles.appointmentTime}>14h30 - Cabinet médical Centre-ville</Text>
          </View>
          <TouchableOpacity style={styles.appointmentButton}>
            <Text style={styles.appointmentButtonText}>Gérer mes RDV</Text>
          </TouchableOpacity>
        </View>

        {/* Santé Quotidienne */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Santé Quotidienne</Text>
          
          <View style={styles.dailyMetricsCard}>
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricEmoji}>😴</Text>
                <Text style={styles.metricValue}>{todayMetrics.sleep}h</Text>
                <Text style={styles.metricLabel}>Sommeil</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricEmoji}>{getMoodEmoji(todayMetrics.mood)}</Text>
                <Text style={styles.metricValue}>{todayMetrics.mood}/10</Text>
                <Text style={styles.metricLabel}>Humeur</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricEmoji}>⚡</Text>
                <Text style={styles.metricValue}>{todayMetrics.energy}/10</Text>
                <Text style={styles.metricLabel}>Énergie</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricEmoji}>😰</Text>
                <Text style={[styles.metricValue, { color: getStressColor(todayMetrics.stress) }]}>
                  {todayMetrics.stress}/10
                </Text>
                <Text style={styles.metricLabel}>Stress</Text>
              </View>
            </View>
            
            <View style={styles.chartSection}>
              <Text style={styles.chartTitle}>Tendance 7 jours</Text>
              {renderMiniChart()}
            </View>
          </View>
        </View>

        {/* Mode de vie */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Mode de vie</Text>
          
          <View style={styles.lifestyleGrid}>
            <View style={styles.lifestyleCard}>
              <Ionicons name="walk-outline" size={24} color="#2ecc71" />
              <Text style={styles.lifestyleNumber}>{lifestyleData.steps.toLocaleString()}</Text>
              <Text style={styles.lifestyleLabel}>Pas aujourd'hui</Text>
              <View style={[styles.progressBar, { backgroundColor: '#e8f5e8' }]}>
                <View style={[styles.progressFill, { 
                  width: `${Math.min((lifestyleData.steps / 10000) * 100, 100)}%`,
                  backgroundColor: '#2ecc71'
                }]} />
              </View>
            </View>

            <View style={styles.lifestyleCard}>
              <Ionicons name="water-outline" size={24} color="#3498db" />
              <Text style={styles.lifestyleNumber}>{lifestyleData.water}</Text>
              <Text style={styles.lifestyleLabel}>Verres d'eau</Text>
              <View style={[styles.progressBar, { backgroundColor: '#e3f2fd' }]}>
                <View style={[styles.progressFill, { 
                  width: `${Math.min((lifestyleData.water / 8) * 100, 100)}%`,
                  backgroundColor: '#3498db'
                }]} />
              </View>
            </View>

            <View style={styles.lifestyleCard}>
              <Ionicons name="nutrition-outline" size={24} color="#f39c12" />
              <Text style={styles.lifestyleNumber}>{lifestyleData.nutritionScore}/10</Text>
              <Text style={styles.lifestyleLabel}>Nutrition</Text>
              <View style={[styles.progressBar, { backgroundColor: '#fef9e7' }]}>
                <View style={[styles.progressFill, { 
                  width: `${(lifestyleData.nutritionScore / 10) * 100}%`,
                  backgroundColor: '#f39c12'
                }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Historique conversations */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Historique Conversations</Text>
          
          {mockRecords.map((record) => (
            <TouchableOpacity key={record.id} style={styles.recordCard}>
              <View style={styles.recordHeader}>
                <View style={styles.recordIcon}>
                  <Text style={styles.recordEmoji}>{getTypeIcon(record.type)}</Text>
                </View>
                <View style={styles.recordInfo}>
                  <Text style={styles.recordTitle}>{record.title}</Text>
                  <Text style={styles.recordDate}>{record.date}</Text>
                </View>
                <View style={[styles.recordType, { backgroundColor: getTypeColor(record.type) }]}>
                  <Text style={styles.recordTypeText}>{record.type}</Text>
                </View>
              </View>
              <Text style={styles.recordSummary}>{record.summary}</Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.loadMoreButton}>
            <Text style={styles.loadMoreText}>Voir plus d'historique</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
