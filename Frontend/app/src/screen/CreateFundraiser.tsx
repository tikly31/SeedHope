import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import BottomNavBar from '../components/BottomNavBar';

const categories = [
  ['Medical', 'Education', 'Disaster'],
  ['Environment', 'Emergency'],
];

export default function CreateFundraiser({ navigation }) {
  const [selectedCity, setSelectedCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal'];

  // Check if all required fields are filled
  const isFormValid = selectedCity && zipCode && selectedCategory;

  return (
    <SafeAreaView style={styles.containers}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Let's begin fundraising!</Text>

        <Text style={styles.question}>Where will the funds go?</Text>

        <View style={styles.inputContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCity}
              onValueChange={(itemValue) => setSelectedCity(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a city" value="" />
              {cities.map((city) => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Zip Code"
            value={zipCode}
            onChangeText={setZipCode}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.question}>
          What best describes why you're fundraising?
        </Text>

        <View style={styles.categoriesContainer}>
          {categories.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.categoryRow}>
              {row.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategory,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={styles.categoryText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !isFormValid && styles.continueButtonDisabled, // Apply disabled style
          ]}
          disabled={!isFormValid} // Disable button if form is not valid
          onPress={() => navigation.navigate('FundraiserBeneficiary')}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.bottomnavbar}>
        <BottomNavBar navigation={navigation} activeScreen="Create" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containers: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  question: {
    fontSize: 18,
    marginBottom: 15,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 25,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  categoriesContainer: {
    marginTop: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedCategory: {
    backgroundColor: '#e3e3e3',
    borderColor: '#666',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  continueButtonDisabled: {
    backgroundColor: '#B0BEC5', // Gray color for disabled state
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomnavbar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
