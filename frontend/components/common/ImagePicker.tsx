import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../constants/theme";

interface ImagePickerProps {
  currentImage?: string;
  onImageSelected?: (imageUri: string) => void;
  size?: number;
  showChangeButton?: boolean;
}

export const ProfileImagePicker: React.FC<ImagePickerProps> = ({
  currentImage,
  onImageSelected,
  size = 100,
  showChangeButton = true,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    currentImage,
  );

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Nous avons besoin de votre permission pour accéder à votre galerie photos.",
          [{ text: "OK" }],
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        onImageSelected?.(imageUri);
      }
    } catch (error) {
      console.error("Erreur lors de la sélection d'image:", error);
      Alert.alert("Erreur", "Impossible de sélectionner l'image");
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        onImageSelected?.(imageUri);
      }
    } catch (error) {
      console.error("Erreur lors de la prise de photo:", error);
      Alert.alert("Erreur", "Impossible de prendre la photo");
    }
  };

  const showImageOptions = () => {
    Alert.alert("Changer la photo", "Choisissez une option", [
      { text: "Annuler", style: "cancel" },
      { text: "Prendre une photo", onPress: takePhoto },
      { text: "Choisir depuis la galerie", onPress: pickImage },
    ]);
  };

  const displayImage = selectedImage || currentImage;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.imageContainer, { width: size, height: size }]}
        onPress={showChangeButton ? showImageOptions : undefined}
        activeOpacity={showChangeButton ? 0.8 : 1}
      >
        {displayImage ? (
          <Image source={{ uri: displayImage }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons
              name="person"
              size={size * 0.4}
              color={colors.textSecondary}
            />
          </View>
        )}

        {showChangeButton && (
          <View style={styles.editOverlay}>
            <Ionicons name="camera" size={20} color={colors.white} />
          </View>
        )}
      </TouchableOpacity>

      {showChangeButton && (
        <TouchableOpacity
          style={styles.changeButton}
          onPress={showImageOptions}
        >
          <Text style={styles.changeButtonText}>Changer la photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  imageContainer: {
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: colors.cardBackground,
    ...shadows.md,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.glassLight,
  },
  editOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  },
  changeButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  changeButtonText: {
    fontSize: typography.footnote,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
});
