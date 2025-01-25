import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  SafeAreaView,
  Modal,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

import { get_current_user } from "../utils/apiUtils";

import AlertModal from "../components/AlertModal";

import CONFIG from "./config";
const API_BASE_URL = CONFIG.API_BASE_URL;

const presetAmounts = [100, 500, 1000, 5000];
const fadeAnim = new Animated.Value(1);

interface FundraiserDetailsProps {
  route: {
    params: {
      fundId: number;
    };
  };
}

export default function DonationPage({ route }: FundraiserDetailsProps) {
  // console.log('DonationPage:', route.params);

  const { fundId } = route.params;
  const navigation = useNavigation();

  // console.log('Here with fundId:', fundId);

  const [amount, setAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [trancationId, setTrancationId] = useState("");

  const [campaignId, setCampaignId] = useState(fundId);

  // New state for payment gateway modal
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentGatewayUrl, setPaymentGatewayUrl] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "failure">("success");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const fetchUserData = async () => {
      try {
        const userData = await get_current_user();
        if (userData) {
          setName(userData.name);
          setEmail(userData.email);
          setPhone(userData.contactno);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handlePresetAmount = (value) => {
    setAmount(value.toString());
    setSelectedPreset(value);
  };

  const handleCustomAmount = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmount(numericValue);
    setSelectedPreset(null);
  };

  const generateTransactionId = () => {
    const timestamp = Date.now().toString(36); // Convert current time to base-36
    const randomString = Math.random().toString(36).substring(2, 10); // Generate a random alphanumeric string
    return `TXN-${timestamp}-${randomString}`;
  };

  const postApicall = async (donation) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/payment/initiate`,
        donation,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // console.log('Payment Initiated Successfully:', response);
      // console.log('Payment Initiated Successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error Initiating Payment:", error.message);
    }
  };

  const handleProceed = async () => {
    const trancationId = generateTransactionId();

    setTrancationId(trancationId);

    // console.log('Amount:', amount);
    // console.log('Name:', name);
    // console.log('Email:', email);
    // console.log('Phone:', phone);
    // console.log('Notes:', notes);
    // console.log('Trancation Id:', trancationId);
    // console.log('Campaign Id:', campaignId);
    // make a obajct with all input
    const donation = {
      amount,
      name,
      email,
      phone,
      notes,
      trancationId,
      campaignId,
    };

    try {
      const response = await postApicall(donation);

      if (response && response.gatewayPageURL) {
        // Set WebView URL and show modal
        setPaymentGatewayUrl(response.gatewayPageURL);
        setPaymentModalVisible(true);
      } else {
        Alert.alert("Error", "Unable to process payment. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Payment initiation failed. Please try again.");
    }
  };

  const updateSuccessPayment = async (trancationId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/payment/success/${trancationId}`
      );
      console.log("Payment Updated Successfully:", response);
      console.log("Payment Updated Successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error Updating Payment:", error.message);
    }
  };

  const updateFailurePayment = async (trancationId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/payment/fail/${trancationId}`
      );
      // console.log('Payment Updated Successfully:', response);
      // console.log('Payment Updated Successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error Updating Payment:", error.message);
    }
  };

  const handleWebViewNavigationStateChange = (newNavState) => {
    const { url } = newNavState;

    // console.log('WebView URL:', url);

    // Customize these conditions based on your payment gateway's response URLs
    if (url.includes("/success")) {
      setPaymentModalVisible(false);
      setAlertType("success");

      setAlertMessage("Payment completed successfully");
      setAlertVisible(true);

      // Add your success handling logic

      updateSuccessPayment(trancationId);
    } else if (url.includes("/fail")) {
      setPaymentModalVisible(false);
      setAlertType("failure");
      setAlertMessage("Payment was unsuccessful. Please try again.");
      setAlertVisible(true);

      // Add your failure handling logic
      updateFailurePayment(trancationId);
    }
  };

  const handleAlertClose = () => {
    setAlertVisible(false);

    if (alertType === "success") {
      // Replace the current route with FundraiserDetailsScreen
      navigation.goBack();
    } else if (alertType === "failure") {
      // Navigate back to DonationPage
      navigation.navigate("DonationPage", { fundId });
    }
  };

  const isValidForm = amount && name && email && phone;

  return (
    <SafeAreaView style={styles.container}>
      <AlertModal
        visible={alertVisible}
        type={alertType}
        message={alertMessage}
        onClose={handleAlertClose}
        onAction={alertType === "success" ? handleAlertClose : undefined}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <View style={styles.header}>
              <Text style={styles.title}>Make a Donation</Text>
              <Text style={styles.subtitle}>
                Your generosity makes a difference
              </Text>
            </View>

            {/* Amount Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Amount</Text>
              <View style={styles.presetContainer}>
                {presetAmounts.map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    style={[
                      styles.presetButton,
                      selectedPreset === preset && styles.selectedPreset,
                    ]}
                    onPress={() => handlePresetAmount(preset)}
                  >
                    <Text
                      style={[
                        styles.presetText,
                        selectedPreset === preset && styles.selectedPresetText,
                      ]}
                    >
                      ৳{preset}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.currencyPrefix}>৳</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={handleCustomAmount}
                  placeholder="Enter custom amount"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Personal Details Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Details</Text>
              <View style={styles.formGroup}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Full Name"
                  placeholderTextColor="#999"
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email Address"
                  keyboardType="email-address"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Notes Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Additional Notes (Optional)
              </Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Any special instructions or messages..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Trust Badges */}
            <View style={styles.trustSection}>
              <MaterialIcons name="security" size={24} color="#4CAF50" />
              <Text style={styles.trustText}>
                Secure payment powered by SSLCOMMERZ
              </Text>
            </View>

            {/* Support Info */}
            <TouchableOpacity style={styles.supportLink}>
              <MaterialIcons name="help-outline" size={20} color="#666" />
              <Text style={styles.supportText}>
                Need help? Contact payment support
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        {/* Payment Button */}
        <View style={styles.footer}>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>Total Amount:</Text>
            <Text style={styles.summaryAmount}>৳{amount || "0"}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.paymentButton,
              !isValidForm && styles.paymentButtonDisabled,
            ]}
            disabled={!isValidForm}
            // call a function that print all input in log
            onPress={handleProceed}
          >
            <LinearGradient
              colors={isValidForm ? ["#54927d", "#54927d"] : ["#ccc", "#bbb"]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <MaterialIcons
                name="lock"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.paymentButtonText}>
                Proceed to Secure Payment
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Payment Gateway Modal */}
      <Modal
        visible={isPaymentModalVisible}
        onRequestClose={() => setPaymentModalVisible(false)}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setPaymentModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <MaterialIcons name="close" size={24} color="black" />
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>

          <WebView
            source={{ uri: paymentGatewayUrl }}
            style={styles.webview}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// Add these to your existing styles
const additionalStyles = {
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    padding: 15,
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  modalCloseButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalCloseText: {
    marginLeft: 5,
    fontSize: 16,
  },
  webview: {
    flex: 1,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  presetContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  presetButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    backgroundColor: "#fff",
  },
  selectedPreset: {
    borderColor: "#1aa7ec",
    backgroundColor: "#E8F5E9",
  },
  presetText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  selectedPresetText: {
    color: "#4CAF50",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  currencyPrefix: {
    fontSize: 20,
    color: "#666",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    color: "#333",
    paddingVertical: 12,
  },
  formGroup: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: "#333",
    height: 120,
    textAlignVertical: "top",
  },
  trustSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  trustText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  supportLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  supportText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
    textDecorationLine: "underline",
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
    backgroundColor: "#fff",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 16,
    color: "#666",
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  paymentButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  paymentButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  paymentButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    padding: 15,
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  modalCloseButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalCloseText: {
    marginLeft: 5,
    fontSize: 16,
  },
  webview: {
    flex: 1,
  },
});
