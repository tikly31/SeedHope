import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
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
    navigation.navigate('FundraiserDetailsScreen', { fundId });
  };

  const handleSearch = (text) => {
    setSearchInput(text);
    // Implement search logic if needed
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text>Loading fundraisers...</Text>
      </View>
    );
  }

  const renderFundraiserSection = ({ item }) => (
    <FundraiserSection
      title={item.title}
      data={item.data}
      onPressFundraiser={handlePressFundraiser}
    />
  );

  const sections = [
    { title: "Trending Fundraisers", data: staticTrendingFundraisers },
    { title: "Emergency Fundraisers", data: emergencyFundraisers },
    { title: "Recent Fundraisers", data: recentFundraisers },
    { title: "Successful Fundraisers", data: successfulFundraisers },
  ];

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
      <TouchableOpacity style={styles.searchContainer} onPress={() => navigation.navigate("SearchScreen")}>
        <Ionicons name="search" size={20} color="#666" />
        <Text style={styles.searchPlaceholder}>Search fundraisers...</Text>
      </TouchableOpacity>

      {/* Main Content */}
      <FlatList
        data={sections}
        renderItem={renderFundraiserSection}
        keyExtractor={(item) => item.title}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.sectionContainer}
        ListFooterComponent={
          <View>
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
        }
      />

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
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  searchPlaceholder: {
    marginLeft: 8,
    color: "#666",
    flex: 1,
  },
  contributorList: {
    paddingHorizontal: 12,
  },
  sectionContainer: {
    paddingBottom: 100, // Ensure enough padding at the bottom
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainScreen1;