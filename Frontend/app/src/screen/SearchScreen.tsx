// SearchScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FundraiserItem from "../components/FundraiserItem"; // Import the renamed component

const dummyFundraisers = [
  {
    fundId: "1",
    title: "Help John Recover from Surgery",
    raisedAmount: 5000,
    goalAmount: 10000,
    dueDate: "2023-12-31",
    photoUrl: "https://via.placeholder.com/80",
  },
  {
    fundId: "2",
    title: "Support Local Animal Shelter",
    raisedAmount: 3000,
    goalAmount: 8000,
    dueDate: "2023-11-15",
    photoUrl: "https://via.placeholder.com/80",
  },
  {
    fundId: "3",
    title: "Community Clean-Up Initiative",
    raisedAmount: 2000,
    goalAmount: 5000,
    dueDate: "2023-10-20",
    photoUrl: "https://via.placeholder.com/80",
  },
  {
    fundId: "4",
    title: "Education for Underprivileged Children",
    raisedAmount: 7000,
    goalAmount: 15000,
    dueDate: "2024-01-10",
    photoUrl: "https://via.placeholder.com/80",
  },
  {
    fundId: "5",
    title: "Help Build a School in Rural Area",
    raisedAmount: 1000,
    goalAmount: 20000,
    dueDate: "2024-05-30",
    photoUrl: "https://via.placeholder.com/80",
  },
];

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchFundraisers();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const searchFundraisers = () => {
    setLoading(true);
    const filteredResults = dummyFundraisers.filter(fundraiser =>
      fundraiser.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredResults);
    setLoading(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search fundraisers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
      ) : (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <FundraiserItem
              item={item}
              onPress={() => navigation.navigate("FundraiserDetailsScreen", { fundId: item.fundId })} // Use fundId here
            />
          )}
          keyExtractor={(item) => item.fundId} // Use fundId as the key
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchQuery ? "No results found" : "Start typing to search fundraisers"}
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    margin: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 10,
  },
  loader: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
  },
});