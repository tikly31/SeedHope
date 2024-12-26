import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

interface DocumentFile {
  name: string;
  size: number;
  uri: string;
}

export default function DocumentUpload({ navigation }) {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [uploadProgress] = useState(new Animated.Value(0));
  const [isUploading, setIsUploading] = useState(false);

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (result.assets && result.assets.length > 0) {
        const newDocs = result.assets.map(asset => ({
          name: asset.name,
          size: asset.size || 0,
          uri: asset.uri,
        }));
        
        setDocuments([...documents, ...newDocs]);
        simulateUpload();
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

        {documents.length > 0 && (
          <View style={styles.documentsContainer}>
            {documents.map((doc, index) => (
              <View key={index} style={styles.documentItem}>
                <View style={styles.documentInfo}>
                  <MaterialIcons name="description" size={24} color="#666" />
                  <View style={styles.documentDetails}>
                    <Text style={styles.documentName} numberOfLines={1}>
                      {doc.name}
                    </Text>
                    <Text style={styles.documentSize}>
                      {formatFileSize(doc.size)}
                    </Text>
                  </View>
                </View>
                {isUploading && (
                  <Animated.View
                    style={[
                      styles.progressBar,
                      {
                        width: uploadProgress.interpolate({
                          inputRange: [0, 100],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  />
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.skipButton} activeOpacity={0.7}
          onPress={() => navigation.navigate('FundraiserSuccess')}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.continueButton,
            isUploading && styles.continueButtonDisabled,
          ]}
          disabled={isUploading}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('FundraiserSuccess')}
        >
          <LinearGradient
            colors={isUploading ? ['#ccc', '#bbb'] : ['#007AFF', '#0055FF']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.continueButtonText}>
              {isUploading ? 'Uploading...' : 'Continue'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
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
});