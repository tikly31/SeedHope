import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomNavBar from "../components/BottomNavBar";

type BeneficiaryOption = "yourself" | "someone" | "charity" | null;

export default function FundraiserBeneficiary({ navigation, route }) {
  const [selectedOption, setSelectedOption] = useState<BeneficiaryOption>(null);

  // Retrieve data from the previous page
  const { dueDate, category } = route.params;

  const options = [
    {
      id: "yourself",
      icon: "hand-wave",
      title: "Yourself",
      description: "Funds are delivered directly to your bank account",
    },
    {
      id: "someone",
      icon: "account-group",
      title: "Someone else",
      description: "You'll invite a beneficiary to receive funds",
    },
    {
      id: "charity",
      icon: "ribbon",
      title: "Charity",
      description: "Funds are delivered to your chosen non profit for you",
    },
  ];

  const handleContinue = () => {
    if (selectedOption) {
      console.log("dueDate : ", dueDate);
      console.log("category :", category);
      navigation.navigate("FundraiserAmount", {
        dueDate,
        category,
      });
    }
  };

  return (
    <SafeAreaView style={styles.containers}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>
          Tell us who you're raising funds for...
        </Text>

        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedOption === option.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedOption(option.id as BeneficiaryOption)}
            >
              <View style={styles.optionContent}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name={option.icon as any}
                    size={24}
                    color={selectedOption === option.id ? "#007AFF" : "#666"}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedOption && styles.continueButtonDisabled,
          ]}
          disabled={!selectedOption}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
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
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  optionsContainer: {
    gap: 15,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 15,
    backgroundColor: "#fff",
  },
  selectedOption: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  continueButtonDisabled: {
    backgroundColor: "#ccc",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomnavbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
