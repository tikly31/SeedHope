import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import BottomNavBar from "../components/BottomNavBar";
import { getPendingCampaigns, updateCampaign} from "../utils/apiUtils";
import { useFocusEffect } from "expo-router";


interface Fundraiser {
  id: number;
  title: string;
  description: string;
  photoUrl?: string;
  goalAmount: number;
  raisedAmount: number;
  dueDate: string;
  isUrgent: boolean;
  organizerId: number;
  category: string;
  status: string;
}

// const DUMMY_POSTS: Post[] = [
//   {
//     id: "1",
//     title: "First Post",
//     summary: "This is a summary of the first post...",
//   },
//   {
//     id: "2",
//     title: "Second Post",
//     summary: "This is a summary of the second post...",
//   },
// ];

export default function PostListScreen({ navigation }) {

  const [posts, setPosts] = useState<Fundraiser[]>([]);
  const fetchPosts = async () => {
    try {
      const funraised = await getPendingCampaigns();
      setPosts(funraised);

      console.log("Fetched posts:", posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }
  useEffect(() => {



    fetchPosts();



  }, []);


  useFocusEffect(
      useCallback(() => {
        fetchPosts();
      }, [])
    );

  const handleApprove = async(fund: Fundraiser) => {

    // set fund status to approved
        const updatedFund = {
          ...fund,
          status: "APPROVED",
        };
    
    
    
        console.log("Fundraiser:", updatedFund);
    
        try{
        const response = await updateCampaign(updatedFund);
        console.log("Fundraiser updated:", response);
        } catch (error) {
          console.error("Error updating fundraiser:", error);
        }
        fetchPosts();

    // Handle approve logic
    console.log("Approved post:", updatedFund);
  };

  const handleReject = async(fund: Fundraiser) => {
    // Handle reject logic


    // set fund status to rejected
        const updatedFund = {
          ...fund,
          status: "REJECTED",
        };
    
        console.log("Fundraiser:", updatedFund);
    
        try{
        const response = await updateCampaign(updatedFund);
        console.log("Fundraiser updated:", response);
        }
        catch (error) {
          console.error("Error updating fundraiser:", error);
        }
        fetchPosts();
        console.log("Rejected post:", updatedFund);
  };

  const renderItem = ({ item }: { item: Fundraiser }) => (
    <View style={styles.postCard}>
      <View style={styles.postContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.summary} numberOfLines={2}>
          {item.category}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.detailsButton]}
          onPress={() =>
            navigation.navigate("PostDetails", { fund: item })
          }
        >
          <Text style={styles.buttonText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.approveButton]}
          onPress={() => handleApprove(item)}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleReject(item)}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <BottomNavBar navigation={navigation} activeScreen="Home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 16,
  },
  postCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postContent: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
  detailsButton: {
    backgroundColor: "#4a90e2",
  },
  approveButton: {
    backgroundColor: "#2ecc71",
  },
  rejectButton: {
    backgroundColor: "#e74c3c",
  },
});
