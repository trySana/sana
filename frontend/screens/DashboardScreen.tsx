// à Changer si jamais c'est un displate copié sur internet
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { styles } from './css/DashboardScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

interface HealthRecord {
  id: string;
  date: string;
  type: 'consultation' | 'symptome' | 'question';
  title: string;
  summary: string;
}

export default function DashboardScreen({ navigation }: Props) {
  const mockRecords: HealthRecord[] = [
    {
      id: '1',
      date: '2025-07-06',
      type: 'consultation',
      title: 'Consultation générale',
      summary: 'Discussion sur les maux de tête récurrents...'
    },
    {
      id: '2',
      date: '2025-07-05',
      type: 'symptome',
      title: 'Fatigue matinale',
      summary: 'Analyse des troubles du sommeil...'
    },
    {
      id: '3',
      date: '2025-07-04',
      type: 'question',
      title: 'Nutrition sportive',
      summary: 'Conseils pour une alimentation équilibrée...'
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return '🩺';
      case 'symptome': return '🌡️';
      case 'question': return '❓';
      default: return '📝';
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>Mon Dashboard</Text>
          <Text style={styles.headerSubtext}>Historique de santé</Text>
        </View>
        <View style={styles.headerAction}>
          <TouchableOpacity 
            style={styles.chatButton}
            onPress={() => navigation.navigate('Chat')}
          >
            <Text style={styles.chatButtonText}>💬</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats rapides */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Consultations</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Cette semaine</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>98%</Text>
          <Text style={styles.statLabel}>Satisfaction</Text>
        </View>
      </View>

      {/* Historique */}
      <ScrollView style={styles.recordsList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Historique récent</Text>
        
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
      </ScrollView>
    </View>
  );
}
