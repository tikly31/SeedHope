import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
// import CONFIG from ../Screen/config;
import CONFIG from "../screen/config";
const API_BASE_URL = CONFIG.API_BASE_URL;

const FundraiserItem = ({ item, onPress }) => {
  const progress = (item.raisedAmount / item.goalAmount) * 100;
  const [id, setid] = useState(item.id);
  const navigation = useNavigation();
  console.log("PhotoUrl", item.photoUrl);
  console.log(API_BASE_URL);
  onPress = () => {
    console.log("id", id);
    navigation.navigate("FundraiserDetailsScreen", { fundId: id });
  };

  return (
    <TouchableOpacity style={styles.fundraiserItem} onPress={onPress}>
      <Image source={{ uri: `${API_BASE_URL}/campaigns/${item.photoUrl}` }} style={styles.fundraiserImage} />
      <View style={styles.fundraiserInfo}>
        <Text style={styles.fundraiserTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.fundraiserDueDate}>
          Due: {new Date(item.dueDate).toLocaleDateString()}
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.fundraiserAmount}>
          ৳{item.raisedAmount ? item.raisedAmount.toLocaleString() : "0"} raised
          of ৳{item.goalAmount ? item.goalAmount.toLocaleString() : "0"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fundraiserItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  fundraiserImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  fundraiserInfo: {
    flex: 1,
  },
  fundraiserTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  fundraiserDueDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginBottom: 5,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  fundraiserAmount: {
    fontSize: 14,
    color: "#666",
  },
});

export default FundraiserItem;
