import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomNavBar from "../components/BottomNavBar";

export default function FundraiserAmount({ navigation, route }) {
  const [amount, setAmount] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = new Animated.Value(1);

  // Retrieve data from the previous page
  const { dueDate, category } = route.params;

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmount(numericValue);

    // Animate button when a valid amount is entered
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.bounce,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const formatAmount = (value: string) => {
    if (!value) return "";
    const number = parseInt(value, 10);
    return number.toLocaleString("en-BD");
  };

  const isValidAmount = amount !== "" && parseInt(amount, 10) > 0;

  const handleContinue = () => {
    if (isValidAmount) {
      navigation.navigate("FundraiserDetails", {
        dueDate,
        category,
        amount: parseInt(amount, 10),
      });
    }
  };

  return (
    <SafeAreaView style={styles.containers}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <LinearGradient colors={["#ffffff", "#f8f9fa"]} style={styles.gradient}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>
                Tell us how much you'd like to raise...
              </Text>
              <Text style={styles.subtitle}>
                Set a realistic goal to help your campaign succeed
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  isFocused && styles.inputWrapperFocused,
                ]}
              >
                <Text style={styles.currencyPrefix}>BDT</Text>
                <TextInput
                  style={styles.input}
                  value={formatAmount(amount)}
                  onChangeText={handleAmountChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                  selectionColor="#007AFF"
                />
              </View>
              <View style={styles.helperTextContainer}>
                <Text style={styles.helperText}>
                  Fundraisers like yours typically aim to raise{" "}
                  <Text style={styles.highlightText}>500k BDT</Text>
                </Text>
              </View>
            </View>

            <Animated.View
              style={[
                styles.buttonContainer,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  !isValidAmount && styles.continueButtonDisabled,
                ]}
                disabled={!isValidAmount}
                activeOpacity={0.8}
                onPress={handleContinue}
              >
                <LinearGradient
                  colors={
                    isValidAmount ? ["#007AFF", "#0055FF"] : ["#ccc", "#bbb"]
                  }
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.continueButtonText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
      <View style={styles.bottomnavbar}>
        <BottomNavBar navigation={navigation} activeScreen="Create" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containers: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputWrapperFocused: {
    borderColor: "#007AFF",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  currencyPrefix: {
    fontSize: 18,
    color: "#666",
    fontWeight: "600",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    color: "#1a1a1a",
    height: "100%",
    fontWeight: "600",
  },
  helperTextContainer: {
    marginTop: 12,
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e1e1e1",
  },
  helperText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 20,
  },
  highlightText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  buttonContainer: {
    marginTop: "auto",
    marginBottom: 24,
    paddingBottom: 30,
  },
  continueButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  bottomnavbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
