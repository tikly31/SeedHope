import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface ProfileData {
  name: string;
  email: string;
  username: string;
  password: string;
  contactno: string;
  picture: string;
  provider: string;
  bio: string;
  gender: string;
}

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Istahak Islam',
    email: 'istahak@example.com',
    username: '_0istahak',
    password: '',
    contactno: '+880123456789',
    picture: '/placeholder.svg?height=200&width=200',
    provider: 'email',
    bio: 'NAi',
    gender: 'Male',
  });
  const [showThreadsBadge, setShowThreadsBadge] = useState(true);

  const handleBack = () => {
    navigation.goBack();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setProfileData(prev => ({ ...prev, picture: result.assets[0].uri }));
    }
  };

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Implement save logic here
    console.log('Saving profile:', profileData);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit profile</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{ uri: profileData.picture }}
              style={styles.profilePicture}
            />
            <Text style={styles.editPictureText}>Edit picture or avatar</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={profileData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="Name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={profileData.username}
              onChangeText={(value) => updateField('username', value)}
              placeholder="Username"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={profileData.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={profileData.contactno}
              onChangeText={(value) => updateField('contactno', value)}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={profileData.bio}
              onChangeText={(value) => updateField('bio', value)}
              placeholder="Bio"
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity style={styles.selectField}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.selectContent}>
              <Text style={styles.selectText}>{profileData.gender}</Text>
              <Feather name="chevron-down" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkButtonText}>Add Link</Text>
          </TouchableOpacity>

          <View style={styles.switchContainer}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Show Threads badge</Text>
              <Text style={styles.switchDescription}>
                When turned off, the Instagram badge on your Threads profile will also disappear.
              </Text>
            </View>
            <Switch
              value={showThreadsBadge}
              onValueChange={setShowThreadsBadge}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={showThreadsBadge ? '#007AFF' : '#f4f3f4'}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  profilePictureContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profilePicture: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  editPictureText: {
    marginTop: 8,
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'center',
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1c1c1e',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectField: {
    marginBottom: 20,
  },
  selectContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selectText: {
    fontSize: 16,
    color: '#1c1c1e',
  },
  linkButton: {
    marginBottom: 20,
  },
  linkButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchTitle: {
    fontSize: 16,
    color: '#1c1c1e',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    color: '#666',
  },
});