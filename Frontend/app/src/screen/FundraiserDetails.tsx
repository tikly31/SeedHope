import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function FundraiserDetails({navigation}) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const characterLimit = 500;

  const isValidForm = title.trim().length > 0 && details.trim().length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.gradient}
      >
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
            <Text style={styles.characterCount}>{title.length}/{characterLimit}</Text>
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
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.button,
            !isValidForm && styles.buttonDisabled,
          ]}
          disabled={!isValidForm}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('DocumentUpload')}
        >
          <LinearGradient
            colors={isValidForm ? ['#007AFF', '#0055FF'] : ['#ccc', '#bbb']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 100,
  },
  characterCount: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
  button: {
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
