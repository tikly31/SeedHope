import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import BottomNavBar from "../components/BottomNavBar";
import { Keyboard } from "react-native";
import { uploadCampaignImage } from "../utils/apiUtils"; // Assuming the upload utility can be used for campaigns too
import CONFIG from "./config";

const API_BASE_URL = CONFIG.API_BASE_URL;

import { pickImage } from "../utils/imagePickerUtils";

export default function FundraiserDetails({ navigation, route }) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const characterLimit = 500;
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  // Destructure the passed params from route
  const { dueDate, category, amount } = route.params || {};

  const isValidForm = title.trim().length > 0 && details.trim().length > 0;

  const handlePickImage = async () => {
    const uri = await pickImage();

    if (!uri) {
      console.warn("Image picking was canceled or returned no URI.");
      return;
    }

    try {
      const formattedImage = {
        uri,
        type: "image/jpeg", // Assuming it's a JPEG
        name: uri.split("/").pop(), // Extract the file name
      };

      const uploadedFileName = await uploadCampaignImage(formattedImage);

      if (uploadedFileName) {
        setImage(uploadedFileName);
        // Optionally display success alert
      } else {
        console.error("Image upload failed.");
        // Optionally display failure alert
      }
    } catch (error) {
      console.error("Error uploading campaign image:", error);
    }
  };

  const handleContinue = () => {
    const campaign = {
      dueDate,
      category,
      amount,
      title,
      details,
      image,
    };

    console.log("Created Campaign:", campaign);

    navigation.navigate("DocumentUpload", { campaign });
  };

  return (
    <SafeAreaView style={styles.containers}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <LinearGradient colors={["#ffffff", "#f8f9fa"]} style={styles.gradient}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Title Section */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>
                Give your fundraiser a title
              </Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter title"
                placeholderTextColor="#999"
                maxLength={characterLimit}
              />
              <Text style={styles.characterCount}>
                {title.length}/{characterLimit}
              </Text>
            </View>

            {/* Details Section */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>
                Why are you raising this fund?
              </Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={details}
                onChangeText={setDetails}
                placeholder="Add details..."
                placeholderTextColor="#999"
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Image Upload Section */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Upload a cover image</Text>
              <TouchableOpacity
                style={styles.imageUploadButton}
                onPress={handlePickImage}
              >
                {image ? (
                  <Image
                    source={{ uri: `${API_BASE_URL}/campaigns/${image}` }}
                    style={styles.uploadedImage}
                  />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <MaterialIcons
                      name="add-photo-alternate"
                      size={40}
                      color="#007AFF"
                    />
                    <Text style={styles.uploadText}>Tap to upload image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.button, !isValidForm && styles.buttonDisabled]}
              disabled={!isValidForm}
              activeOpacity={0.8}
              onPress={handleContinue}
            >
              <LinearGradient
                colors={isValidForm ? ["#007AFF", "#0055FF"] : ["#ccc", "#bbb"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>

        {/* Fixed Submit Button */}
        {/* <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            style={[styles.button, !isValidForm && styles.buttonDisabled]}
            disabled={!isValidForm}
            activeOpacity={0.8}
            onPress={handleContinue}
          >
            <LinearGradient
              colors={isValidForm ? ["#007AFF", "#0055FF"] : ["#ccc", "#bbb"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View> */}

        {/* Bottom Navigation Bar */}
      </KeyboardAvoidingView>
      {!keyboardVisible && (
        <BottomNavBar navigation={navigation} activeScreen="Create" />
      )}
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
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Adds enough space at the bottom for the fixed button
  },
  inputSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 100,
  },
  characterCount: {
    marginTop: 5,
    fontSize: 12,
    color: "#666",
  },
  imageUploadButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    height: 200,
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  uploadText: {
    marginTop: 10,
    color: "#666",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  button: {
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 20, // Adds horizontal spacing for the button
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 70, // Ensures the button doesn’t overlap with the bottom navigation bar
    width: "100%",
    paddingHorizontal: 20, // Adds padding to the sides
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 60, // Adjust based on the height of your bottom navigation bar
    backgroundColor: "#fff", // Optional: background color for the bottom navigation bar
    borderTopWidth: 1,
    borderColor: "#ddd", // Optional: a border at the top for separation
  },
});
