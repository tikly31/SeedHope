import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get_current_user } from './apiUtils';

import CONFIG from './config';

const API_BASE_URL = CONFIG.API_BASE_URL;

interface ProfileData {
  name: string;
  email: string;
  username: string;
  password: string; // This can be used for the current password
  contactno: string;
  picture: string;
  provider: string;
  bio: string;
  gender: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    username: '',
    password: '123', // Simulated stored password
    contactno: '',
    picture: '',
    provider: '',
    bio: '',
    gender: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [error, setError] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const userData = await get_current_user();
          if (userData) {
            setProfileData(prev => ({
              ...prev,
              name: userData.name || '',
              email: userData.email || '',
              username: userData.username || '',
              contactno: userData.contactno || '',
              picture: userData.picture || '',
              provider: userData.provider || '',
              bio: userData.bio || '',
              gender: userData.gender || '',
            }));
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    fetchUserData();
  }, []);

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

    // Clear the error for the specific field if the user starts typing
    if (error[field]) {
      setError(prev => ({ ...prev, [field]: false }));
    }
  };


  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve the token from AsyncStorage
      if (!token) {
        alert("User not authenticated");
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/update/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include the token in the request headers
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          username: profileData.username,
          password: profileData.password, // Ensure this is handled securely
          contactno: profileData.contactno,
          picture: profileData.picture,
          provider: profileData.provider,
          bio: profileData.bio,
          gender: profileData.gender,
        }),
      });
  
      if (response.ok) {
        const updatedUser = await response.json();
        alert("Profile updated successfully!");
        setProfileData(updatedUser); // Update local state with the response data
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile");
    }
  };


  const handleChangePassword = async () => {
    const storedPassword = profileData.password; // Simulated stored password

    // Clear previous errors
    setError({
      currentPassword: false,
      newPassword: false,
      confirmNewPassword: false,
    });

    // Check if the current password is valid
    if (profileData.currentPassword !== storedPassword) {
      setError(prev => ({ ...prev, currentPassword: true }));
      alert("Current password is invalid!");
      updateField('currentPassword', '');
      updateField('newPassword', '');
      updateField('confirmNewPassword', '');
      return;
    }

    // Check if new password and confirm password match
    if (profileData.newPassword !== profileData.confirmNewPassword) {
      setError(prev => ({ ...prev, confirmNewPassword: true }));
      alert("New passwords do not match!");
      updateField('currentPassword', '');
      updateField('newPassword', '');
      updateField('confirmNewPassword', '');
      return;
    }

    // Here you would typically send the new password to your backend to update it
    console.log('Changing password to:', profileData.newPassword);
    alert("Password changed successfully!");

    // Optionally, reset the password fields
    updateField('currentPassword', '');
    updateField('newPassword', '');
    updateField('confirmNewPassword', '');
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

          {/* Gender Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <Picker
              selectedValue={profileData.gender}
              onValueChange={(itemValue) => updateField('gender', itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Others" value="Others" />
            </Picker>
          </View>

          {/* Password Change Fields */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={[styles.input, error.currentPassword && styles.errorInput]}
              value={profileData.currentPassword}
              onChangeText={(value) => updateField('currentPassword', value)}
              placeholder="Current Password"
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={[styles.input, error.newPassword && styles.errorInput]}
              value={profileData.newPassword}
              onChangeText={(value) => updateField('newPassword', value)}
              placeholder="New Password"
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={[styles.input, error.confirmNewPassword && styles.errorInput]}
              value={profileData.confirmNewPassword}
              onChangeText={(value) => updateField('confirmNewPassword', value)}
              placeholder="Confirm New Password"
              secureTextEntry
            />
          </View>

          <TouchableOpacity onPress={handleChangePassword} style={styles.changePasswordButton}>
            <Text style={styles.changePasswordButtonText}>Change Password</Text>
          </TouchableOpacity>
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
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 8,
  },
  changePasswordButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  changePasswordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorInput: {
    borderColor: 'red',
  },
});