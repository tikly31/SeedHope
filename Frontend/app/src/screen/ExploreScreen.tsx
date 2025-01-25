import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import BottomNavBar from "../components/BottomNavBar"

interface CategoryButtonProps {
  icon: string
  label: string
  gradient: string[]
  onPress: () => void
}

const CategoryButton = ({ icon, label, gradient, onPress }: CategoryButtonProps) => (
  <TouchableOpacity style={styles.categoryButton} onPress={onPress}>
    <LinearGradient colors={gradient} style={styles.iconContainer} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <MaterialCommunityIcons name={icon} size={32} color="#FFFFFF" />
    </LinearGradient>
    <Text style={styles.categoryLabel}>{label}</Text>
  </TouchableOpacity>
)

export default function ExploreScreen({ navigation }) {
  const categories = [
    { icon: "school", label: "Education", gradient: ["#FF6B6B", "#FF8E8E"] },
    { icon: "hospital-box", label: "Medical", gradient: ["#4ECDC4", "#45B7AF"] },
    { icon: "home-flood", label: "Disaster", gradient: ["#6C5CE7", "#8278E9"] },
    { icon: "leaf", label: "Environment", gradient: ["#A8E6CF", "#8ED7B6"] },
    { icon: "alarm-light", label: "Emergency", gradient: ["#FFB900", "#FF9B00"] },
    { icon: "heart", label: "Family", gradient: ["#FF78B9", "#FF96C7"] },
    { icon: "football", label: "Sports", gradient: ["#3498DB", "#2980B9"] },
    { icon: "charity", label: "Community", gradient: ["#00B894", "#00A187"] },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <CategoryButton
              key={index}
              icon={category.icon}
              label={category.label}
              gradient={category.gradient}
              onPress={() =>
                navigation.navigate("CategoryScreen", {
                  category: category.label.toLowerCase(),
                })
              }
            />
          ))}
        </View>
      </ScrollView>
      {/* <View style={styles.bottomNavContainer}> */}
        <BottomNavBar navigation={navigation} activeScreen="Explore" />
      {/* </View> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
    
  },
  header: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3748",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 120, // Add extra padding at the bottom to ensure all content is visible
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryButton: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 16,
    alignItems: "center",
  },
  iconContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#4A5568",
    textAlign: "center",
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
})

