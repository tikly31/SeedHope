import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

import CONFIG from './config';
const API_BASE_URL = CONFIG.API_BASE_URL;

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 16px padding on each side, 16px gap between cards

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

export default function CategoryScreen({ route }) {
  const { category } = route.params;
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/campaign/category?category=${encodeURIComponent(category)}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }
        const data = await response.json();
        setDonations(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [category]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4299E1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Campaigns in {category}</Text>
      <View style={styles.grid}>
        {donations.map((donation, index) => (
          <View
            key={donation.id}
            style={[
              styles.cardWrapper,
              index % 2 !== 0 && { marginLeft: 16 }, // Add spacing between cards in a row
            ]}
          >
            <FundraiserCard
              id={donation.id}
              title={donation.title}
              amount={donation.goalAmount-donation.raisedAmount}
              imageUrl={`${API_BASE_URL}/campaigns/${donation.photoUrl}`}
              onPress={(id) => console.log(`Selected donation with ID: ${id}`)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
    marginVertical: 16,
    marginBottom: 24, // Adds extra space below the heading
  },
  scrollContent: {
    paddingBottom: 80, // Ensure content doesn't overlap with the navbar
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardImageContainer: {
    height: 120,
    backgroundColor: '#E2E8F0',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    padding: 8,
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  cardAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4299E1',
    padding: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 16,
    textAlign: 'center',
  },
});
