import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function LogoutScreen() {
  const navigation = useNavigation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const scaleAnim = new Animated.Value(0.95);

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear all stored data
      await AsyncStorage.clear();

      // Add any additional logout logic here (e.g., API calls)
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      // Navigate to Login screen
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name="logout" size={40} color="#ff9966" />
        </View>

        <Text style={styles.title}>Logout</Text>
        <Text style={styles.message}>
          Are you sure you want to logout? You'll need to login again to access
          your account.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={isLoggingOut}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.logoutButtonText}>Logout</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.helpLink}
          onPress={() => navigation.navigate("Support")}
        >
          <MaterialIcons name="help-outline" size={16} color="#007AFF" />
          <Text style={styles.helpText}>Need help?</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: width - 48,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFE5E5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1c1c1e",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginBottom: 16,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  logoutButton: {
    backgroundColor: "#ff9966",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  helpLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  helpText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
});
