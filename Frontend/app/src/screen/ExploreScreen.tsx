import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavBar from "../components/BottomNavBar";

interface CategoryButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

const CategoryButton = ({ icon, label, onPress }: CategoryButtonProps) => (
  <TouchableOpacity style={styles.categoryButton} onPress={onPress}>
    <View style={styles.iconContainer}>{icon}</View>
    <Text style={styles.categoryLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function ExploreScreen({ navigation }) {
  const categories = [
    {
      icon: <Ionicons name="book-outline" size={32} color="#4A5568" />,
      label: "Education",
    },
    {
      icon: <Ionicons name="medkit-outline" size={32} color="#4A5568" />,
      label: "Medical",
    },
    {
      icon: <Ionicons name="cloud-outline" size={32} color="#4A5568" />,
      label: "Disaster",
    },
    {
      icon: <Ionicons name="leaf-outline" size={32} color="#4A5568" />,
      label: "Environment",
    },
    {
      icon: <Ionicons name="alarm-outline" size={32} color="#4A5568" />,
      label: "Emergency",
    },
  ];

  // Helper function to group categories into rows of two
  const groupedCategories = categories.reduce((rows, category, index) => {
    if (index % 2 === 0) rows.push([]);
    rows[rows.length - 1].push(category);
    return rows;
  }, [] as Array<Array<{ icon: React.ReactNode; label: string }>>);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Categories</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {groupedCategories.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((category, colIndex) => (
              <CategoryButton
                key={colIndex}
                icon={category.icon}
                label={category.label}
                onPress={() =>
                  navigation.navigate("CategoryScreen", {
                    category: category.label.toLowerCase(),
                  })
                }
              />
            ))}
          </View>
        ))}
      </ScrollView>
      <BottomNavBar navigation={navigation} activeScreen="Home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2D3748",
    padding: 20,
    paddingBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  categoryButton: {
    width: "48%",
    aspectRatio: 1,
    alignItems: "center",
  },
  iconContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "white",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#4A5568",
    textAlign: "center",
  },
});
