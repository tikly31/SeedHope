import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const PROFILE_IMAGE_SIZE = 80;

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('fundraisers');
  const navigation = useNavigation();

  const highlights = [
    { id: '1', title: 'Medical', icon: '🏥' },
    { id: '2', title: 'Education', icon: '📚' },
    { id: '3', title: 'Emergency', icon: '🆘' },
    { id: '4', title: 'Community', icon: '🤝' },
  ];

  const fundraisers = [
    { id: '1', image: '/placeholder.svg?height=200&width=200', title: 'Medical Fund', amount: '৳50,000' },
    { id: '2', image: '/placeholder.svg?height=200&width=200', title: 'Education Support', amount: '৳30,000' },
    { id: '3', image: '/placeholder.svg?height=200&width=200', title: 'Emergency Aid', amount: '৳25,000' },
  ];

  // handle edit profile button click
  const handleEditProfile = () => {
    navigation.navigate('EditProfileScreen1');
  };

  // handle menu button click
  const handleMenu = () => {
    // Add your logic here
    navigation.navigate('LogoutScreen');
  };

  // handle plus button click

  const handlePlus = () => {
    // Add your logic here
    navigation.navigate('CreateFundraiser');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.usernameContainer}>
            <Text style={styles.username}>rahman_ajij</Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton} onPress={handlePlus}>
              <Feather name="plus-square" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}  onPress={handleMenu}>
              <Feather name="menu" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: '/placeholder.svg?height=200&width=200' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.addStoryButton}>
              <Feather name="plus" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Fundraisers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>৳150K</Text>
              <Text style={styles.statLabel}>Raised</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Donated</Text>
            </View>
          </View>
        </View>

        {/* Bio */}
        <View style={styles.bioContainer}>
          <Text style={styles.name}>Ajij Rahman</Text>
          <Text style={styles.bioText}>Helping others through fundraising</Text>
          <Text style={styles.bioText}>🎓 Student at XYZ University</Text>
          <Text style={styles.bioText}>📍 Dhaka, Bangladesh</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Highlights */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.highlightsContainer}
        >
          {highlights.map((highlight) => (
            <TouchableOpacity key={highlight.id} style={styles.highlightItem}>
              <View style={styles.highlightCircle}>
                <Text style={styles.highlightIcon}>{highlight.icon}</Text>
              </View>
              <Text style={styles.highlightTitle}>{highlight.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'fundraisers' && styles.activeTab]}
            onPress={() => setActiveTab('fundraisers')}
          >
            <MaterialCommunityIcons 
              name="hand-heart" 
              size={24} 
              color={activeTab === 'fundraisers' ? '#007AFF' : '#666'}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'donations' && styles.activeTab]}
            onPress={() => setActiveTab('donations')}
          >
            <MaterialCommunityIcons 
              name="gift-outline" 
              size={24} 
              color={activeTab === 'donations' ? '#007AFF' : '#666'}
            />
          </TouchableOpacity>
        </View>

        {/* Grid */}
        <View style={styles.gridContainer}>
          {fundraisers.map((item) => (
            <TouchableOpacity key={item.id} style={styles.gridItem}>
              <Image source={{ uri: item.image }} style={styles.gridImage} />
              <View style={styles.gridOverlay}>
                <Text style={styles.gridTitle}>{item.title}</Text>
                <Text style={styles.gridAmount}>{item.amount}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 10,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
  },
  addStoryButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  bioContainer: {
    padding: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bioText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    padding: 8,
  },
  editButtonText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    padding: 8,
  },
  shareButtonText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  highlightsContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  highlightItem: {
    alignItems: 'center',
    marginHorizontal: 5,
    width: 70,
  },
  highlightCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  highlightIcon: {
    fontSize: 24,
  },
  highlightTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: width / 3,
    height: width / 3,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
  },
  gridTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  gridAmount: {
    color: '#fff',
    fontSize: 11,
  },
});