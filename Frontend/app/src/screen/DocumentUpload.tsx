import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';

import CONFIG from './config';
const API_BASE_URL = CONFIG.API_BASE_URL;

interface DocumentFile {
  name: string;
  size: number;
  uri: string;
}

export default function DocumentUpload({ navigation, route }) {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [uploadProgress] = useState(new Animated.Value(0));
  const [isUploading, setIsUploading] = useState(false);
  const [organizerId, setOrganizerId] = useState<string | null>(null);

  const { campaign } = route.params; // Campaign object passed from previous page

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.error('No token found!');
          return;
        }

        const response = await fetch(`http://${API_BASE_URL}/currentuser`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch current user:', response.statusText);
          return;
        }

        const userData = await response.json();
        setOrganizerId(userData.id); // Extract and set organizer ID
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUserId();
  }, []);

  const uploadDocumentToServer = async (fileUri: string, fileName: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No authentication token found.');
        return;
      }

      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: 'image/jpeg', // or 'image/png', depending on the file type
      });

      const response = await fetch(`http://${API_BASE_URL}/upload/photo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        console.error('Failed to upload document:', response.statusText);
        Alert.alert('Error', 'Failed to upload the document.');
        return;
      }

      const result = await response.text(); // Backend returns success message or path
      console.log('File uploaded successfully:', result);
      Alert.alert('Success', 'File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Error', 'An error occurred while uploading the document.');
    }
  };


  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*'], // Accept only image files
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        const newDoc = {
          name: result.name,
          size: result.size || 0,
          uri: result.uri,
        };

        setDocuments([...documents, newDoc]);

        // Upload the file to the server
        await uploadDocumentToServer(newDoc.uri, newDoc.name);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };


  const simulateUpload = () => {
    setIsUploading(true);
    uploadProgress.setValue(0);

    Animated.timing(uploadProgress, {
      toValue: 100,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      setIsUploading(false);
    });
  };

  const handleSubmit = async () => {
    if (!organizerId) {
      Alert.alert('Error', 'Failed to fetch the organizer ID.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No authentication token found.');
        return;
      }

      // Add `organizerId` and document details to the campaign
      const campaignData = {
        title: campaign.title, // Campaign title passed from the previous page
        description: campaign.details, // Campaign description
        category: campaign.category, // Campaign category
        goalAmount: campaign.amount, // Goal amount for the campaign
        dueDate: campaign.dueDate, // Due date of the campaign
        organizerId: organizerId, // Organizer ID fetched from the backend
        photoUrl: documents.length > 0 ? documents[0].uri : null, // First document URI as photo URL
        raisedAmount: 0.0, // Initial raised amount is 0.0
        status: 'PENDING', // Default status is PENDING
        creationDate: new Date().toISOString().split('T')[0], // Current date and time
      };

      const response = await fetch(`http://${API_BASE_URL}/campaign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
      });

      if (!response.ok) {
        console.error('Failed to create campaign:', response.statusText);
        Alert.alert('Error', 'Failed to create the campaign.');
        return;
      }

      const createdCampaign = await response.json();
      console.log('Campaign created successfully:', createdCampaign);

      Alert.alert('Success', 'Campaign created successfully!');
      navigation.navigate('FundraiserSuccess');
    } catch (error) {
      console.error('Error creating campaign:', error);
      Alert.alert('Error', 'An error occurred while creating the campaign.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Add your documents</Text>
          <Text style={styles.subtitle}>
            To boost authenticity, include your documents!
          </Text>
        </View>

        {organizerId && <Text style={styles.organizerId}>Organizer ID: {organizerId}</Text>}

        <TouchableOpacity
          onPress={handleDocumentPick}
          style={styles.uploadButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF9500', '#FF8000']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialIcons name="file-upload" size={24} color="#fff" />
            <Text style={styles.uploadButtonText}>Add File</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, isUploading && styles.continueButtonDisabled]}
          disabled={isUploading}
          activeOpacity={0.8}
          onPress={handleSubmit}
        >
          <LinearGradient
            colors={isUploading ? ['#ccc', '#bbb'] : ['#007AFF', '#0055FF']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.continueButtonText}>
              {isUploading ? 'Uploading...' : 'Submit Campaign'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.ButtonNavBar}>
        <BottomNavBar navigation={navigation} activeScreen="Create" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
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
    lineHeight: 22,
  },
  uploadButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  documentsContainer: {
    gap: 12,
  },
  documentItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    overflow: 'hidden',
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  documentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  documentSize: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 2,
    backgroundColor: '#007AFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  footer: {
    padding: 24,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 80,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '600',
  },
  continueButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  ButtonNavBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
