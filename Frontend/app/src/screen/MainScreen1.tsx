import React, { useState, useEffect } from 'react';
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
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import BottomNavBar from '../components/BottomNavBar';
import { useNavigation } from '@react-navigation/native';
import FundraiserSection from '../components/FundraiserSection';
import ContributorCircle from '../components/ContributorCircle';
import logo from '../assets/image.png';
import profile from '../assets/profile.jpg';
import defaultContributorImage from '../assets/default_contributor.jpg';
import CONFIG from './config';

const API_BASE_URL = CONFIG.API_BASE_URL;

export default function MainScreen1() {
  const navigation = useNavigation();
  const [searchInput, setSearchInput] = useState('');
  const [fundraisers, setFundraisers] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [emergencyFundraisers, setEmergencyFundraisers] = useState([]);
  const [recentFundraisers, setRecentFundraisers] = useState([]);
  const [successfulFundraisers, setSuccessfulFundraisers] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  const staticTrendingFundraisers = [
    { id: '100', title: 'Save the Forest', photoUrl: 'camp1.jpg', amount: '$5,000' },
    { id: '200', title: 'Clean Water Project', photoUrl: 'camp2.jpg', amount: '$3,000' },
    { id: '300', title: 'Education Fund', photoUrl: 'camp3.jpg', amount: '$8,000' },
    { id: '400', title: 'Medical Aid', photoUrl: 'camp4.jpg', amount: '$12,000' },
  ];

  useEffect(() => {
    const loadData = async () => {
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

    loadData();
  }, []);

  const handlePressFundraiser = (fundId) => {
    // console.log('Navigating with fundId:', fundId);
    navigation.navigate('FundraiserDetailsScreen', { fundId });
  };

  const handleSearch = (text: string) => {
    setSearchInput(text);
    // Assuming you want to filter the fundraisers based on the search input
    const filtered = staticTrendingFundraisers.filter(fundraiser =>
      fundraiser.title.toLowerCase().includes(text.toLowerCase())
    );
    setFundraisers(filtered);
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
        <Image source={logo} style={styles.logo} />
        <TouchableOpacity>
          <Image source={profile} style={styles.profilePhoto} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search fundraisers..."
          value={searchInput}
          onChangeText={handleSearch}
        />
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
              <ContributorCircle 
                image={item.picture ? `${API_BASE_URL}/user/${item.picture}` : defaultContributorImage} 
                name={item.name} 
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contributorList}
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavBar navigation={navigation} activeScreen="Home" isAdmin={true} />
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
    padding: 10,
  },
  logo: {
    width: 120,
    height: 25,
  },
  profilePhoto: {
    width: 35,
    height: 35,
    borderRadius: 16,
    marginRight: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    padding: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    color: '#666',
  },
  contributorList: {
    paddingHorizontal: 12,
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainScreen1;