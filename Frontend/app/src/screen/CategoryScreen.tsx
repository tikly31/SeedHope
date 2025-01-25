import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  Text,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FundraiserCard from "../components/FundraiserCard";
import CONFIG from "./config";
import BottomNavBar from '../components/BottomNavBar';

const API_BASE_URL = CONFIG.API_BASE_URL;
const { width } = Dimensions.get("window");

export default function CategoryScreen({ route, navigation }) {
  const { category } = route.params;
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, [category]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/campaign/category?category=${encodeURIComponent(
          category
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch campaigns");
      }
      const data = await response.json();
      setDonations(data);
      setFilteredDonations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text) => {
    setSearchText(text);

    if (text.trim() === "") {
      setFilteredDonations(donations);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/campaign/${encodeURIComponent(
          category
        )}/search?searchTerm=${encodeURIComponent(text)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();
      setFilteredDonations(data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const renderItem = ({ item }) => (
    <FundraiserCard
      id={item.id}
      title={item.title}
      imageUri={`${API_BASE_URL}/campaigns/${item.photoUrl}`}
      remainingAmount={item.goalAmount - item.raisedAmount}
      goalAmount={item.goalAmount}
      raisedAmount={item.raisedAmount}
      onPress={(id) =>
        navigation.navigate("FundraiserDetailsScreen", { fundId: id })
      }
    />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      {searchText.trim() !== "" ? (
        <>
          <Ionicons name="search-outline" size={50} color="#A0AEC0" />
          <Text style={styles.emptyText}>No fundraisers found</Text>
          <Text style={styles.emptySubText}>
            We couldn't find any fundraisers matching "{searchText}"
          </Text>
          <Text style={styles.emptyTips}>Try:</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipText}>• Using more general keywords</Text>
            <Text style={styles.tipText}>• Checking for typos</Text>
            <Text style={styles.tipText}>• Using fewer keywords</Text>
          </View>
        </>
      ) : (
        <>
          <Ionicons name="folder-open-outline" size={50} color="#A0AEC0" />
          <Text style={styles.emptyText}>No fundraisers yet</Text>
          <Text style={styles.emptySubText}>
            Check back later for new fundraising campaigns
          </Text>
        </>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4299E1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Campaigns in {category}</Text>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#A0AEC0"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search fundraisers..."
          value={searchText}
          onChangeText={handleSearch}
          placeholderTextColor="#A0AEC0"
        />
      </View>

      <FlatList
        data={filteredDonations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          filteredDonations.length === 0 && styles.emptyListContent
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
      />
      <BottomNavBar navigation={navigation}/>
    </SafeAreaView>
  );
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#2D3748",
    fontSize: 16,
  },
  listContent: {
    paddingLeft: 12,
    paddingBottom: 24,
  },
  emptyListContent: {
    flexGrow: 1,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
    minHeight: 400, // Ensures proper spacing even with few items
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A5568',
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  emptyTips: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginTop: 24,
    alignSelf: 'flex-start',
    paddingLeft: 16,
  },
  tipsList: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingLeft: 16,
  },
  tipText: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 22,
  },
});