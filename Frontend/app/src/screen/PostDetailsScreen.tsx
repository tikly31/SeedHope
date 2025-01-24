import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
} from "react-native";
import profile from "../assets/profile.jpg"; // Import the profile image
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the profile icon

export default function PostDetailsScreen({ route, navigation }) {
  const { postId } = route.params;

  // Dummy values for the post details
  const [post, setPost] = useState({
    title: "Sample Post Title",
    dueDate: "2024-01-15",
    author: "John Doe",
    authorId: "12345", // Added authorId
    goalAmount: "10,000",
    description:
      "This is a detailed description of the post. It contains all the necessary information that an admin would need to make a decision about approving or rejecting this post. The description can be quite long and will be scrollable within the screen.",
    imageUrl: "https://via.placeholder.com/400x300",
  });

  const handleApprove = () => {
    // Handle approve logic
    console.log("Approved post:", postId);
    navigation.goBack();
  };

  const handleReject = () => {
    // Handle reject logic
    console.log("Rejected post:", postId);
    navigation.goBack();
  };

  const handleDownload = () => {
    // In a real app, you would use a library like react-native-fs to download the file
    console.log("Downloading zip file...");
    // Simulating download with a link
    Linking.openURL("https://www.google.com/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: post.imageUrl }} style={styles.image} />
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.label}>Title</Text>
              <Text style={styles.title}>{post.title}</Text>
            </View>
            <View style={styles.dueContainer}>
              <Text style={styles.label}>Due</Text>
              <Text style={styles.dueDate}>{post.dueDate}</Text>
            </View>
          </View>

          <View style={styles.authorContainer}>
            <Text style={styles.label}>Author</Text>
            <View style={styles.authorInfo}>
              <Image
                source={profile} // Placeholder for author profile image
                style={styles.profileImage}
              />
              <View style={styles.authorDetails}>
                <Text style={styles.authorName}>{post.author}</Text>
                <Text style={styles.authorId}>ID: {post.authorId}</Text>
                {/* Displaying author ID */}
              </View>
            </View>
          </View>

          <View style={styles.goalContainer}>
            <Text style={styles.label}>Goal Amount</Text>
            <Text style={styles.goalAmount}>${post.goalAmount}</Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.description}>{post.description}</Text>
          </View>

          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDownload}
          >
            <Text style={styles.downloadButtonText}>Download Zip File</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={handleReject}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.approveButton]}
          onPress={handleApprove}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: "#f0f0f0",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  titleContainer: {
    flex: 2,
    marginRight: 16,
  },
  dueContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  dueDate: {
    fontSize: 16,
  },
  authorContainer: {
    marginBottom: 16,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  authorDetails: {
    flexDirection: "column",
  },
  authorName: {
    fontSize: 16,
    fontWeight: "500",
  },
  authorId: {
    paddingLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  goalContainer: {
    marginBottom: 16,
  },
  goalAmount: {
    fontSize: 16,
    fontWeight: "500",
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  downloadButton: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  downloadButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "white",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  approveButton: {
    backgroundColor: "#2ecc71",
  },
  rejectButton: {
    backgroundColor: "#e74c3c",
  },
});
