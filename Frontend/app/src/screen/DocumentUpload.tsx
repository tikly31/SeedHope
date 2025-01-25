import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import BottomNavBar from "../components/BottomNavBar";
import { get_current_user, uploadDocument } from "../utils/apiUtils";
import CONFIG from "./config";

const API_BASE_URL = CONFIG.API_BASE_URL;

export default function DocumentUpload({ navigation, route }) {
  const [document, setDocument] = useState(null);
  const [organizerId, setOrganizerId] = useState(null);

  const { campaign } = route.params;

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const userData = await get_current_user();
      if (userData) {
        setOrganizerId(userData.id);
      } else {
        console.error("Failed to fetch current user");
      }
    };
    fetchCurrentUserId();
  }, []);

  const uploadDocumentToServer = async (fileUri, fileName, fileType) => {
    try {
      const file = { uri: fileUri, name: fileName, type: fileType };
      const uploadedFileUrl = await uploadDocument(file);
      if (!uploadedFileUrl) {
        Alert.alert("Error", "Failed to upload the document.");
        return;
      }
      console.log("File uploaded successfully:", uploadedFileUrl);
      setDocument({ name: fileName, uri: uploadedFileUrl, type: fileType });
      Alert.alert("Success", "File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading document:", error);
      Alert.alert("Error", "An error occurred while uploading the document.");
    }
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      console.log("Document Picker Result:", result); // Debug log

      if (result.canceled) {
        console.log("User canceled document selection.");
        return; // Exit if user cancels
      }

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0]; // Handle the new response format
        console.log("Picked file:", file);

        setDocument(null); // Remove previous file
        await uploadDocumentToServer(
          file.uri,
          file.name,
          file.mimeType || "application/pdf"
        );
      } else {
        console.log("No document received.");
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };

  const handleSubmit = async () => {
    if (!organizerId) {
      Alert.alert(
        "Error",
        "Organizer ID is not set yet. Please wait a moment and try again."
      );
      return;
    }

    try {
      //       const token = await AsyncStorage.getItem("token");
      //       if (!token) {
      //         Alert.alert("Error", "No authentication token found.");
      //         return;
      //       }

      console.log("Document : ", document.name);

      const campaignData = {
        title: campaign.title,
        description: campaign.details,
        category: campaign.category,
        goalAmount: campaign.amount,
        dueDate: campaign.dueDate,
        organizerId,
        photoUrl: campaign.image || "http://placehold.it/300",
        raisedAmount: 0.0,
        status: "PENDING",
        document: document ? document.uri : "", // Attach uploaded document URL
      };

      const response = await fetch(`${API_BASE_URL}/campaign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        console.error("Failed to create campaign:", response.statusText);
        Alert.alert("Error", "Failed to create the campaign.");
        return;
      }

      Alert.alert("Success", "Campaign created successfully!");
      navigation.navigate("FundraiserSuccess");
    } catch (error) {
      console.error("Error creating campaign:", error);
      Alert.alert("Error", "An error occurred while creating the campaign.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Add Your Documents</Text>
        <Text style={styles.subtitle}>
          To boost authenticity, include your documents!
        </Text>
        {organizerId && (
          <Text style={styles.organizerId}>Organizer ID: {organizerId}</Text>
        )}
        {document && (
          <Text style={styles.documentName}>Uploaded: {document.name}</Text>
        )}
        <TouchableOpacity
          onPress={handleDocumentPick}
          style={styles.uploadButton}
        >
          <LinearGradient
            colors={["#1aa7ec", "#1aa7ec"]}
            style={styles.gradient}
          >
            <MaterialIcons name="file-upload" size={24} color="#fff" />
            <Text style={styles.uploadButtonText}>Add File</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleSubmit}>
          <LinearGradient
            colors={["#54927d", "#54927d"]}
            style={styles.gradient}
          >
            <Text style={styles.continueButtonText}>Submit</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <BottomNavBar navigation={navigation} activeScreen="Create" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666" },
  uploadButton: { borderRadius: 12, overflow: "hidden", marginBottom: 24 },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center content horizontally
    padding: 16,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginTop: 12,
  },
  footer: {
    padding: 24,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
  },
  continueButton: { 
    borderRadius: 12, 
    overflow: "hidden", 
    width: "100%", 
    alignSelf: "center",
  },
  continueButtonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "600",
  },
});

