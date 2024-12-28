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
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';
import { useNavigation } from '@react-navigation/native';

// Mock data for fundraisers
const mockFundraisers = [
  { id: '1', title: 'Save the Forest', amount: '$5,000' },
  { id: '2', title: 'Clean Water Project', amount: '$3,000' },
  { id: '3', title: 'Education Fund', amount: '$8,000' },
  { id: '4', title: 'Medical Aid', amount: '$12,000' },
];

const mockContributors = [
  { id: '1', name: 'John D.', image: 'https://placeholder.com/50' , contribution: '$100'},
  { id: '2', name: 'Sarah M.', image: 'https://placeholder.com/50', contribution: '$50' },
  { id: '3', name: 'Mike R.', image: 'https://placeholder.com/50' , contribution: '$25'},
  { id: '4', name: 'Lisa K.', image: 'https://placeholder.com/50' , contribution: '$10'},
  { id: '5', name: 'David S.', image: 'https://placeholder.com/50' , contribution: '$5'},
  { id: '6', name: 'Jane D.', image: 'https://placeholder.com/50' , contribution: '$1'},
  { id: '7', name: 'Alex P.', image: 'https://placeholder.com/50' , contribution: '$1'},
  { id: '8', name: 'Emily W.', image: 'https://placeholder.com/50' , contribution: '$1'},
];

// Sort contributors by contribution amount and get the top 5
const sortedContributors = mockContributors
  .sort((a, b) => b.contribution - a.contribution)
  .slice(0, 5);

interface FundraiserCardProps {
  id: string;
  title: string;
  amount: string;
  onPress: (id: string) => void;
}

const FundraiserCard = ({ id, title, amount, onPress }: FundraiserCardProps) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(id)}>
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

const FundraiserSection = ({ title, data, onPressFundraiser }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <FundraiserCard
          key={item.id}
          id={item.id}
          title={item.title}
          amount={item.amount}
          onPress={onPressFundraiser}
        />
      )}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.fundraiserList}
    />
  </View>
);

export default function MainScreen1() {
  const navigation = useNavigation();

  const handlePressFundraiser = (fundId: string) => {
    navigation.navigate('FundraiserDetailsScreen', {
      fundId,
    });
  };

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
          data={mockFundraisers}
          onPressFundraiser={handlePressFundraiser}
        />
        <FundraiserSection
          title="Emergency Fundraisers"
          data={mockFundraisers}
          onPressFundraiser={handlePressFundraiser}
        />
        <FundraiserSection
          title="Recent Fundraisers"
          data={mockFundraisers}
          onPressFundraiser={handlePressFundraiser}
        />
        <FundraiserSection
          title="Successful Fundraisers"
          data={mockFundraisers}
          onPressFundraiser={handlePressFundraiser}
        />

        {/* Top Contributors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Contributors</Text>
          <FlatList
            data={sortedContributors}
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
            data={sortedContributors}
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

