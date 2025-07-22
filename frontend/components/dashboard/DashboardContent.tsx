import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HealthRecord {
  id: string;
  date: string;
  type: "consultation" | "symptome" | "question";
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

interface DashboardContentProps {
  onChatPress?: () => void;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  onChatPress,
}) => {
  const [todayMetrics] = useState<DailyMetrics>({
    mood: 7,
    energy: 6,
    stress: 4,
    sleep: 7.5,
  });

  // Données mode de vie
  const [lifestyleData] = useState<LifestyleData>({
    steps: 8450,
    water: 6,
    nutritionScore: 8,
  });

  // Données historiques (7 derniers jours pour le graphique)
  const [weeklyData] = useState([
    { day: "Lun", mood: 6, energy: 7, stress: 5 },
    { day: "Mar", mood: 7, energy: 6, stress: 6 },
    { day: "Mer", mood: 8, energy: 8, stress: 3 },
    { day: "Jeu", mood: 5, energy: 5, stress: 7 },
    { day: "Ven", mood: 9, energy: 9, stress: 2 },
    { day: "Sam", mood: 8, energy: 7, stress: 3 },
    { day: "Auj", mood: 7, energy: 6, stress: 4 },
  ]);

  const mockRecords: HealthRecord[] = [
    {
      id: "1",
      date: "2025-07-15",
      type: "consultation",
      title: "Consultation SANA",
      summary:
        "Discussion sur les maux de tête récurrents et conseils pour améliorer le sommeil...",
    },
    {
      id: "2",
      date: "2025-07-14",
      type: "symptome",
      title: "Fatigue matinale",
      summary:
        "Analyse des troubles du sommeil et recommandations personnalisées...",
    },
    {
      id: "3",
      date: "2025-07-13",
      type: "question",
      title: "Nutrition et énergie",
      summary:
        "Conseils pour une alimentation équilibrée et boost d'énergie naturel...",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "consultation":
        return "🩺";
      case "symptome":
        return "🌡️";
      case "question":
        return "❓";
      default:
        return "💬";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "consultation":
        return "#4a90e2";
      case "symptome":
        return "#e74c3c";
      case "question":
        return "#2ecc71";
      default:
        return "#95a5a6";
    }
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return "😊";
    if (mood >= 6) return "🙂";
    if (mood >= 4) return "😐";
    return "😔";
  };

  const getStressColor = (stress: number) => {
    if (stress <= 3) return "#2ecc71"; // Vert (faible)
    if (stress <= 6) return "#f39c12"; // Orange (moyen)
    return "#e74c3c"; // Rouge (élevé)
  };

  const renderMiniChart = () => {
    const maxValue = 10;
    const chartWidth = 250;
    const chartHeight = 80;

    return (
      <View style={styles.miniChart}>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#4a90e2" }]} />
            <Text style={styles.legendText}>Humeur</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#2ecc71" }]} />
            <Text style={styles.legendText}>Énergie</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#e74c3c" }]} />
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
                      backgroundColor: "#4a90e2",
                      marginRight: 1,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.chartBar,
                    {
                      height: (data.energy / maxValue) * chartHeight,
                      backgroundColor: "#2ecc71",
                      marginRight: 1,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.chartBar,
                    {
                      height: (data.stress / maxValue) * chartHeight,
                      backgroundColor: "#e74c3c",
                    },
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
    <ScrollView
      style={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Section Actions Rapides */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity
          style={styles.primaryActionButton}
          onPress={onChatPress}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color="#ffffff" />
          <View style={styles.actionButtonContent}>
            <Text style={styles.actionButtonTitle}>Parler à SANA</Text>
            <Text style={styles.actionButtonSubtitle}>
              Posez vos questions santé
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="rgba(255,255,255,0.8)"
          />
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
          <Text style={styles.appointmentDetails}>
            Dr. Martin - Médecin généraliste
          </Text>
          <Text style={styles.appointmentTime}>
            14h30 - Cabinet médical Centre-ville
          </Text>
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
              <Text style={styles.metricEmoji}>
                {getMoodEmoji(todayMetrics.mood)}
              </Text>
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
              <Text
                style={[
                  styles.metricValue,
                  { color: getStressColor(todayMetrics.stress) },
                ]}
              >
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
            <Text style={styles.lifestyleNumber}>
              {lifestyleData.steps.toLocaleString()}
            </Text>
            <Text style={styles.lifestyleLabel}>Pas aujourd'hui</Text>
            <View style={[styles.progressBar, { backgroundColor: "#e8f5e8" }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min((lifestyleData.steps / 10000) * 100, 100)}%`,
                    backgroundColor: "#2ecc71",
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.lifestyleCard}>
            <Ionicons name="water-outline" size={24} color="#3498db" />
            <Text style={styles.lifestyleNumber}>{lifestyleData.water}</Text>
            <Text style={styles.lifestyleLabel}>Verres d'eau</Text>
            <View style={[styles.progressBar, { backgroundColor: "#e3f2fd" }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min((lifestyleData.water / 8) * 100, 100)}%`,
                    backgroundColor: "#3498db",
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.lifestyleCard}>
            <Ionicons name="nutrition-outline" size={24} color="#f39c12" />
            <Text style={styles.lifestyleNumber}>
              {lifestyleData.nutritionScore}/10
            </Text>
            <Text style={styles.lifestyleLabel}>Nutrition</Text>
            <View style={[styles.progressBar, { backgroundColor: "#fef9e7" }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(lifestyleData.nutritionScore / 10) * 100}%`,
                    backgroundColor: "#f39c12",
                  },
                ]}
              />
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
                <Text style={styles.recordEmoji}>
                  {getTypeIcon(record.type)}
                </Text>
              </View>
              <View style={styles.recordInfo}>
                <Text style={styles.recordTitle}>{record.title}</Text>
                <Text style={styles.recordDate}>{record.date}</Text>
              </View>
              <View
                style={[
                  styles.recordType,
                  { backgroundColor: getTypeColor(record.type) },
                ]}
              >
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

      {/* Espacement final pour le scroll */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

// Styles exactement comme le collègue les a définis
const styles = StyleSheet.create({
  // CONTENU SCROLLABLE
  scrollContent: {
    flex: 1,
    paddingHorizontal: 12,
  },

  // ACTIONS RAPIDES
  quickActionsContainer: {
    marginTop: 20,
    marginBottom: 15,
  },
  primaryActionButton: {
    backgroundColor: "#4a90e2",
    borderRadius: 15,
    padding: 20,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonContent: {
    flex: 1,
    marginLeft: 15,
  },
  actionButtonTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#ffffff",
    marginBottom: 2,
  },
  actionButtonSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  secondaryActionsRow: {
    flexDirection: "row" as const,
    gap: 10,
  },
  secondaryActionButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryActionText: {
    fontSize: 12,
    color: "#2c3e50",
    fontWeight: "600" as const,
    marginTop: 6,
    textAlign: "center" as const,
  },

  // WIDGET PROCHAIN RDV
  appointmentWidget: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#4a90e2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  widgetHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 12,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#2c3e50",
    marginLeft: 8,
  },
  appointmentInfo: {
    marginBottom: 15,
  },
  appointmentDate: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#4a90e2",
    marginBottom: 4,
  },
  appointmentDetails: {
    fontSize: 16,
    color: "#2c3e50",
    marginBottom: 2,
  },
  appointmentTime: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  appointmentButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start" as const,
  },
  appointmentButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600" as const,
  },

  // SECTIONS
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#2c3e50",
    marginBottom: 15,
  },

  // SANTÉ QUOTIDIENNE
  dailyMetricsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricsGrid: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: 25,
  },
  metricItem: {
    alignItems: "center" as const,
    flex: 1,
  },
  metricEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#4a90e2",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: "#7f8c8d",
    textAlign: "center" as const,
  },

  // GRAPHIQUE MINI
  chartSection: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 20,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#2c3e50",
    marginBottom: 15,
    textAlign: "center" as const,
  },
  miniChart: {
    alignItems: "center" as const,
  },
  chartLegend: {
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    marginBottom: 15,
    gap: 15,
  },
  legendItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  legendText: {
    fontSize: 11,
    color: "#7f8c8d",
  },
  chartContainer: {
    flexDirection: "row" as const,
    alignItems: "flex-end" as const,
    justifyContent: "space-between" as const,
    height: 90,
    width: 250,
  },
  chartDay: {
    alignItems: "center" as const,
    flex: 1,
  },
  chartBars: {
    flexDirection: "row" as const,
    alignItems: "flex-end" as const,
    marginBottom: 5,
  },
  chartBar: {
    width: 3,
    borderRadius: 1.5,
    minHeight: 5,
  },
  chartDayLabel: {
    fontSize: 10,
    color: "#7f8c8d",
  },

  // MODE DE VIE
  lifestyleGrid: {
    flexDirection: "row" as const,
    gap: 12,
  },
  lifestyleCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lifestyleNumber: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#2c3e50",
    marginTop: 8,
    marginBottom: 4,
  },
  lifestyleLabel: {
    fontSize: 11,
    color: "#7f8c8d",
    textAlign: "center" as const,
    marginBottom: 10,
  },
  progressBar: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    overflow: "hidden" as const,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },

  // CARTES HISTORIQUE
  recordCard: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 10,
  },
  recordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafe",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginRight: 12,
  },
  recordEmoji: {
    fontSize: 20,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#2c3e50",
    marginBottom: 2,
  },
  recordDate: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  recordType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recordTypeText: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
  },
  recordSummary: {
    fontSize: 14,
    color: "#34495e",
    lineHeight: 20,
  },
  loadMoreButton: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 25,
    alignItems: "center" as const,
    marginVertical: 20,
  },
  loadMoreText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600" as const,
  },
});
