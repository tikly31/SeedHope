import React, { useState } from "react"
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
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as ImagePicker from "expo-image-picker"
import { MaterialIcons } from "@expo/vector-icons"
import BottomNavBar from "../components/BottomNavBar"

import {pickImage} from "../utils/imagePickerUtils"

export default function FundraiserDetails({ navigation, route }) {
  const [title, setTitle] = useState("")
  const [details, setDetails] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const characterLimit = 500

  // Destructure the passed params from route
  const { dueDate, category, amount } = route.params || {}

  const isValidForm = title.trim().length > 0 && details.trim().length > 0

  const pickImagehandle = async () => {
    const image = await pickImage()
    if (image) {
      setImage(image)
    }
  };




  const handleContinue = () => {
    // Create Campaign object
    const campaign = {
      dueDate,
      category,
      amount,
      title,
      details,
      image,
    }

    console.log("Created Campaign:", campaign)

    // Pass Campaign object to the next screen
    navigation.navigate("DocumentUpload", { campaign })
  }

  return (
    <SafeAreaView style={styles.containers}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
        <LinearGradient colors={["#ffffff", "#f8f9fa"]} style={styles.gradient}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Give your fundraiser a title</Text>
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

            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Why are you raising this fund?</Text>
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

            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Upload a cover image</Text>
              <TouchableOpacity style={styles.imageUploadButton} onPress={pickImagehandle}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.uploadedImage} />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <MaterialIcons name="add-photo-alternate" size={40} color="#007AFF" />
                    <Text style={styles.uploadText}>Tap to upload image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

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
        </LinearGradient>
      </KeyboardAvoidingView>
      <View style={styles.bottomNav}>
        <BottomNavBar navigation={navigation} activeScreen="Create" />
      </View>
    </SafeAreaView>
  )
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
    margin: 20,
    borderRadius: 10,
    overflow: "hidden",
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
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
})

