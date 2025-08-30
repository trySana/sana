import AsyncStorage from "@react-native-async-storage/async-storage";

// Test de persistance de session
export const testSessionPersistence = async () => {
  console.log("=== TEST DE PERSISTANCE DE SESSION ===");

  try {
    // 1. Vérifier l'état initial
    console.log("1. État initial:");
    const initialToken = await AsyncStorage.getItem("user_token");
    const initialUserData = await AsyncStorage.getItem("user_data");
    console.log("   Token:", initialToken ? "Présent" : "Absent");
    console.log("   UserData:", initialUserData ? "Présent" : "Absent");

    // 2. Simuler une session
    console.log("2. Simulation d'une session:");
    const testSession = {
      token: "test_token_123",
      user: {
        username: "testuser",
        email: "test@example.com",
        sex: "MALE",
        date_of_birth: "1990-01-01",
      },
      rememberMe: true,
      expiresAt: 0,
    };

    await AsyncStorage.setItem("user_token", testSession.token);
    await AsyncStorage.setItem("user_data", JSON.stringify(testSession.user));
    await AsyncStorage.setItem(
      "remember_me",
      JSON.stringify(testSession.rememberMe),
    );
    await AsyncStorage.setItem("session_expires_at", "0");

    console.log("   Session simulée sauvegardée");

    // 3. Vérifier la sauvegarde
    console.log("3. Vérification de la sauvegarde:");
    const savedToken = await AsyncStorage.getItem("user_token");
    const savedUserData = await AsyncStorage.getItem("user_data");
    console.log(
      "   Token sauvegardé:",
      savedToken === testSession.token ? "OK" : "ÉCHEC",
    );
    console.log("   UserData sauvegardé:", savedUserData ? "OK" : "ÉCHEC");

    // 4. Simuler un rafraîchissement (nettoyer la mémoire)
    console.log("4. Simulation d'un rafraîchissement:");
    // En React Native, on ne peut pas vraiment "rafraîchir" mais on peut vérifier la persistance

    // 5. Vérifier la récupération
    console.log("5. Vérification de la récupération:");
    const retrievedToken = await AsyncStorage.getItem("user_token");
    const retrievedUserData = await AsyncStorage.getItem("user_data");
    const retrievedRememberMe = await AsyncStorage.getItem("remember_me");
    const retrievedExpiresAt = await AsyncStorage.getItem("session_expires_at");

    console.log(
      "   Token récupéré:",
      retrievedToken === testSession.token ? "OK" : "ÉCHEC",
    );
    console.log("   UserData récupéré:", retrievedUserData ? "OK" : "ÉCHEC");
    console.log(
      "   RememberMe récupéré:",
      retrievedRememberMe === "true" ? "OK" : "ÉCHEC",
    );
    console.log(
      "   ExpiresAt récupéré:",
      retrievedExpiresAt === "0" ? "OK" : "ÉCHEC",
    );

    // 6. Nettoyer le test
    console.log("6. Nettoyage du test:");
    await AsyncStorage.multiRemove([
      "user_token",
      "user_data",
      "remember_me",
      "session_expires_at",
    ]);
    console.log("   Données de test supprimées");

    // 7. Résumé
    const success =
      retrievedToken === testSession.token &&
      retrievedUserData &&
      retrievedRememberMe === "true" &&
      retrievedExpiresAt === "0";

    console.log("=== RÉSULTAT DU TEST ===");
    console.log(
      success
        ? "✅ SUCCÈS: Session persistante"
        : "❌ ÉCHEC: Session non persistante",
    );

    return success;
  } catch (error) {
    console.error("❌ ERREUR lors du test:", error);
    return false;
  }
};

// Test de performance de la session
export const testSessionPerformance = async () => {
  console.log("=== TEST DE PERFORMANCE DE SESSION ===");

  const iterations = 100;
  const startTime = Date.now();

  try {
    for (let i = 0; i < iterations; i++) {
      const testData = {
        token: `token_${i}`,
        user: { username: `user${i}`, email: `user${i}@test.com` },
      };

      await AsyncStorage.setItem("test_token", testData.token);
      await AsyncStorage.setItem("test_user", JSON.stringify(testData.user));

      const retrievedToken = await AsyncStorage.getItem("test_token");
      const retrievedUser = await AsyncStorage.getItem("test_user");

      if (retrievedToken !== testData.token || !retrievedUser) {
        throw new Error(`Échec à l'itération ${i}`);
      }
    }

    const endTime = Date.now();
    const duration = endTime - startTime;
    const avgTime = duration / iterations;

    console.log(`✅ Test de performance réussi:`);
    console.log(`   Itérations: ${iterations}`);
    console.log(`   Durée totale: ${duration}ms`);
    console.log(`   Temps moyen: ${avgTime.toFixed(2)}ms`);

    // Nettoyer
    await AsyncStorage.multiRemove(["test_token", "test_user"]);

    return { success: true, duration, avgTime };
  } catch (error) {
    console.error("❌ Test de performance échoué:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
