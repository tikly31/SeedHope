import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import BottomNavBar from '../components/BottomNavBar';
import { useNavigation } from '@react-navigation/native';

import CONFIG from './config';
const API_BASE_URL = CONFIG.API_BASE_URL;
// const API_BASE_URL = 'http://192.168.0.106:8080'; // Replace with your actual backend URL

const FundraiserCard = ({ id, title, imageUrl, amount, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(id)}>
    <View style={styles.cardImageContainer}>
      <Image
        source={{ uri: imageUrl}} // Use dynamic imageUrl or fallback to placeholder
        style={styles.cardImage}
        resizeMode="cover" // Ensure the image covers the entire area
      />
    </View>
    <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
    <Text style={styles.cardAmount}>{amount}</Text>
  </TouchableOpacity>
);


const ContributorCircle = ({ image, name }) => (
  <View style={styles.contributorContainer}>
    <Image source={{ uri: image }} style={styles.contributorImage} />
    <Text style={styles.contributorName} numberOfLines={1}>{name}</Text>
  </View>
);

const FundraiserSection = ({ title, data, onPressFundraiser }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {data.length === 0 ? (
      <Text style={styles.noDataText}>No fundraisers available.</Text>
    ) : (
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <FundraiserCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={`${API_BASE_URL}/campaigns/${item.photoUrl}`}
            amount={item.goalAmount-item.raisedAmount}
            onPress={onPressFundraiser}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.fundraiserList}
      />
    )}
  </View>
);

export default function MainScreen1() {
  const navigation = useNavigation();

  const [emergencyFundraisers, setEmergencyFundraisers] = useState([]);
  const [recentFundraisers, setRecentFundraisers] = useState([]);
  const [successfulFundraisers, setSuccessfulFundraisers] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [loading, setLoading] = useState(true);
   const staticTrendingFundraisers = [
      { id: '100', title: 'Save the Forest', photoUrl:'camp1.jpg', amount: '$5,000' },
      { id: '200', title: 'Clean Water Project', photoUrl:'camp2.jpg',amount: '$3,000' },
      { id: '300', title: 'Education Fund', photoUrl:'camp3.jpg',amount: '$8,000' },
      { id: '400', title: 'Medical Aid', photoUrl:'camp4.jpg',amount: '$12,000' },
    ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emergencyRes, recentRes, successfulRes, contributorsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/campaign/sorted?sortBy=emergency`),
          axios.get(`${API_BASE_URL}/campaign/sorted?sortBy=recent`),
          axios.get(`${API_BASE_URL}/campaign/successful`),
          axios.get(`${API_BASE_URL}/contributors`),
        ]);
        setEmergencyFundraisers(emergencyRes.data);
        setRecentFundraisers(recentRes.data);
        setSuccessfulFundraisers(successfulRes.data);
        setTopContributors(contributorsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePressFundraiser = (fundId) => {
    console.log('Navigating with fundId:', fundId);
    navigation.navigate('FundraiserDetailsScreen', { fundId });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text>Loading fundraisers...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://placeholder.com/logo.png' }}
          style={styles.logo}
        />
        <TouchableOpacity>
          <Image
            source={{ uri: 'https://placeholder.com/profile.png' }}
            style={styles.profilePhoto}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <Text style={styles.searchPlaceholder}>Search fundraisers...</Text>
      </View>

      {/* Main Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <FundraiserSection
          title="Trending Fundraisers"
          data={staticTrendingFundraisers}
          onPressFundraiser={handlePressFundraiser}
        />
        <FundraiserSection
          title="Emergency Fundraisers"
          data={emergencyFundraisers}
          onPressFundraiser={handlePressFundraiser}
        />
        <FundraiserSection
          title="Recent Fundraisers"
          data={recentFundraisers}
          onPressFundraiser={handlePressFundraiser}
        />
        <FundraiserSection
          title="Successful Fundraisers"
          data={successfulFundraisers}
          onPressFundraiser={handlePressFundraiser}
        />

        {/* Top Contributors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Contributors</Text>
          <FlatList
            data={topContributors}
            renderItem={({ item }) => (
              <ContributorCircle image={`${API_BASE_URL}/user/${item.picture}` || 'https://placeholder.com/50'} name={item.name} />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contributorList}
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavBar navigation={navigation} activeScreen="Home" />
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
    padding: 16,
  },
  logo: {
    width: 32,
    height: 32,
  },
  profilePhoto: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  searchPlaceholder: {
    marginLeft: 8,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
  },
  fundraiserList: {
    paddingHorizontal: 12,
  },
  contributorList: {
    paddingHorizontal: 12,
  },
  contributorContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  contributorImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  contributorName: {
    fontSize: 12,
    marginTop: 4,
    maxWidth: 60,
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 160,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImageContainer: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 8,
  },
  cardAmount: {
    fontSize: 14,
    color: '#2196F3',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  noDataText: {
    marginLeft: 16,
    fontSize: 14,
    color: '#999',
  },
});