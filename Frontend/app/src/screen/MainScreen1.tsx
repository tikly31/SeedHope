import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Search, Home, Compass, PlusCircle, User } from 'lucide-react';
import BottomNavBar from '../components/BottomNavBar';

// Mock data for fundraisers
const mockFundraisers = [
  { id: '1', title: 'Save the Forest', amount: '$5,000' },
  { id: '2', title: 'Clean Water Project', amount: '$3,000' },
  { id: '3', title: 'Education Fund', amount: '$8,000' },
  { id: '4', title: 'Medical Aid', amount: '$12,000' },
];

const mockContributors = [
  { id: '1', name: 'John D.', image: 'https://placeholder.com/50' },
  { id: '2', name: 'Sarah M.', image: 'https://placeholder.com/50' },
  { id: '3', name: 'Mike R.', image: 'https://placeholder.com/50' },
  { id: '4', name: 'Lisa K.', image: 'https://placeholder.com/50' },
];

const FundraiserCard = ({ title, amount }) => (
  <TouchableOpacity style={styles.card}>
    <View style={styles.cardImageContainer}>
      <Image
        source={{ uri: 'https://placeholder.com/100' }}
        style={styles.cardImage}
      />
    </View>
    <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
    <Text style={styles.cardAmount}>{amount}</Text>
  </TouchableOpacity>
);

const ContributorCircle = ({ image, name }) => (
  <TouchableOpacity style={styles.contributorContainer}>
    <Image source={{ uri: image }} style={styles.contributorImage} />
    <Text style={styles.contributorName} numberOfLines={1}>{name}</Text>
  </TouchableOpacity>
);

const FundraiserSection = ({ title, data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <FundraiserCard title={item.title} amount={item.amount} />
      )}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.fundraiserList}
    />
  </View>
);

export default function MainScreen1({ navigation }) {
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
        <Search size={20} color="#666" />
        <Text style={styles.searchPlaceholder}>Search fundraisers...</Text>
      </View>

      {/* Main Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <FundraiserSection title="Trending Fundraisers" data={mockFundraisers} />
        <FundraiserSection title="Emergency Fundraisers" data={mockFundraisers} />
        <FundraiserSection title="Recent Fundraisers" data={mockFundraisers} />
        <FundraiserSection title="Successful Fundraisers" data={mockFundraisers} />

        {/* Top Contributors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Contributors</Text>
          <FlatList
            data={mockContributors}
            renderItem={({ item }) => (
              <ContributorCircle image={item.image} name={item.name} />
            )}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contributorList}
          />
        </View>

        {/* Top Fundraisers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Fundraisers</Text>
          <FlatList
            data={mockContributors}
            renderItem={({ item }) => (
              <ContributorCircle image={item.image} name={item.name} />
            )}
            keyExtractor={item => item.id}
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
});

