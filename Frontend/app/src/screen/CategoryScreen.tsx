import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import CONFIG from "./config"

const API_BASE_URL = CONFIG.API_BASE_URL

const { width } = Dimensions.get("window")
const CARD_WIDTH = (width - 48) / 2 // 16px padding on each side, 16px gap between cards

const FundraiserCard = ({ id, title, imageUrl, amount, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(id)}>
    <View style={styles.cardImageContainer}>
      <Image source={{ uri: imageUrl }} style={styles.cardImage} resizeMode="cover" />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.cardAmount}>৳{amount.toLocaleString()} left</Text>
    </View>
  </TouchableOpacity>
)

export default function CategoryScreen({ route, navigation }) {
  const { category } = route.params
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/campaign/category?category=${encodeURIComponent(category)}`)
        if (!response.ok) {
          throw new Error("Failed to fetch campaigns")
        }
        const data = await response.json()
        setDonations(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [category])

  const renderItem = ({ item, index }) => (
    <View style={[styles.cardWrapper, index % 2 !== 0 && { marginLeft: 16 }]}>
      <FundraiserCard
        id={item.id}
        title={item.title}
        amount={item.goalAmount - item.raisedAmount}
        imageUrl={`${API_BASE_URL}/campaigns/${item.photoUrl}`}
        onPress={(id) => navigation.navigate("FundraiserDetails", { fundId: id })}
      />
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4299E1" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Campaigns in {category}</Text>
      <FlatList
        data={donations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3748",
    marginVertical: 16,
    marginHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImageContainer: {
    height: 120,
    backgroundColor: "#E2E8F0",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 4,
    lineHeight: 20,
  },
  cardAmount: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4299E1",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 16,
    textAlign: "center",
  },
})

