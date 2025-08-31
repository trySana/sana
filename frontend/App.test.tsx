import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { TestComponent } from "./components/common/TestComponent";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧪 Test App</Text>
        <Text style={styles.subtitle}>Version simplifiée pour debug</Text>
      </View>

      <TestComponent />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ✅ Si vous voyez ceci, l'app fonctionne !
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
  },
  footer: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
