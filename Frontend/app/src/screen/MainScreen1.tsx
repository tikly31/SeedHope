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
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';
import { useNavigation } from '@react-navigation/native';
import FundraiserSection from '../components/FundraiserSection';
import ContributorCircle from '../components/ContributorCircle';
import logo from '../assets/image.png';
import profile from '../assets/profile.jpg';
import defaultContributorImage from '../assets/default_contributor.jpg';

// Mock data for fundraisers
const mockFundraisers = [
  { id: '1', title: 'Save the Forest', amount: '$5,000' },
  { id: '2', title: 'Clean Water Project', amount: '$3,000' },
  { id: '3', title: 'Education Fund', amount: '$8,000' },
  { id: '4', title: 'Medical Aid', amount: '$12,000' },
];

// Mock data for contributors
const mockContributors = [
  { id: '1', name: 'John D.', image: '', contribution: '$100' },
  { id: '2', name: 'Sarah M.', image: '', contribution: '$50' },
  { id: '3', name: 'Mike R.', image: '', contribution: '$25' },
  { id: '4', name: 'Lisa K.', image: '', contribution: '$10' },
  { id: '5', name: 'David S.', image: '', contribution: '$5' },
  { id: '6', name: 'Jane D.', image: '', contribution: '$1' },
  { id: '7', name: 'Alex P.', image: '', contribution: '$1' },
  { id: '8', name: 'Emily W.', image: '', contribution: '$1' },
];

// Function to fetch fundraisers
const fetchFundraisers = async () => {
  // Replace this with an API call in the future
  return mockFundraisers;
};

// Function to fetch contributors
const fetchContributors = async () => {
  // Replace this with an API call in the future
  return mockContributors;
};

export default function MainScreen1() {
  const navigation = useNavigation();
  const [searchInput, setSearchInput] = useState('');
  const [fundraisers, setFundraisers] = useState([]);
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const fetchedFundraisers = await fetchFundraisers();
      setFundraisers(fetchedFundraisers);

      const fetchedContributors = await fetchContributors();
      const sortedContributors = fetchedContributors
        .sort((a, b) => parseFloat(b.contribution.slice(1)) - parseFloat(a.contribution.slice(1)))
        .slice(0, 5);
      setContributors(sortedContributors);
    };

    loadData();
  }, []);

  const handlePressFundraiser = (fundId: string) => {
    navigation.navigate('FundraiserDetailsScreen', {
      fundId,
    });
  };

  const handleSearch = (text: string) => {
    setSearchInput(text);
    const filtered = fundraisers.filter(fundraiser =>
      fundraiser.title.toLowerCase().includes(text.toLowerCase())
    );
    setFundraisers(filtered);
  };

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
          data={fundraisers}
          onPressFundraiser={handlePressFundraiser}
        />
        <FundraiserSection
          title="Emergency Fundraisers"
          data={fundraisers}
          onPressFundraiser={handlePressFundraiser}
        />
        <FundraiserSection
          title="Recent Fundraisers"
          data={fundraisers}
          onPressFundraiser={handlePressFundraiser}
        />
        <FundraiserSection
          title="Successful Fundraisers"
          data={fundraisers}
          onPressFundraiser={handlePressFundraiser}
        />

        {/* Top Contributors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Contributors</Text>
          <FlatList
            data={contributors}
            renderItem={({ item }) => (
              <ContributorCircle
                image={item.image || defaultContributorImage}
                name={item.name}
              />
            )}
            keyExtractor={item => item.id}
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
});