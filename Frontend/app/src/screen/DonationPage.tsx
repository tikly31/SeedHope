import React, { useState } from 'react';
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
  Linking,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

const presetAmounts = [100, 500, 1000, 5000];
const fadeAnim = new Animated.Value(1);

export default function DonationPage() {
  const [amount, setAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [trancationId, setTrancationId] = useState('');

  const [campaignId, setCampaignId] = useState('');

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePresetAmount = (value) => {
    setAmount(value.toString());
    setSelectedPreset(value);
  };

  const handleCustomAmount = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
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
        'http://localhost:8080/api/payment/initiate',
        donation,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('Payment Initiated Successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error Initiating Payment:', error.message);
    }
  };
  

  const handleProceed = async () => {


    const trancationId = generateTransactionId();

    setTrancationId(trancationId);
    setCampaignId("4");

    console.log('Amount:', amount);
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Notes:', notes);
    console.log('Trancation Id:', trancationId);
    console.log('Campaign Id:', campaignId);
    // make a obajct with all input 
    const donation = {
      amount,
      name,
      email,
      phone,
      notes,
      trancationId,
      campaignId
    };


    const response = await postApicall(donation);
    

    if (response && response.gatewayPageURL) {
      console.log('Redirecting to:', response.gatewayPageURL);
      window.location.replace(response.gatewayPageURL);

    } else {
      console.error('Invalid response or missing gateway URL.');
    }

    








  };

  const isValidForm = amount && name && email && phone;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
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
              <Text style={styles.subtitle}>Your generosity makes a difference</Text>
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
              <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
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
            <Text style={styles.summaryAmount}>৳{amount || '0'}</Text>
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
              colors={isValidForm ? ['#4CAF50', '#45a049'] : ['#ccc', '#bbb']}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  presetButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    backgroundColor: '#fff',
  },
  selectedPreset: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  presetText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  selectedPresetText: {
    color: '#4CAF50',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  currencyPrefix: {
    fontSize: 20,
    color: '#666',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    color: '#333',
    paddingVertical: 12,
  },
  formGroup: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
    height: 120,
    textAlignVertical: 'top',
  },
  trustSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  trustText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  supportLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  supportText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    backgroundColor: '#fff',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  paymentButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});