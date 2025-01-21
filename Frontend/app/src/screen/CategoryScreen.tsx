import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import DonationCard from '../components/DonationCard';
import BottomNavBar from '../components/BottomNavBar';

export default function CategoryScreen({ route, navigation }) {
  const { category } = route.params;
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        setError(null);

        const mockDonations = [
          { id: 1, title: "Support Local Hospital", currentAmount: 5000, totalAmount: 10000, dueDate: "2025-12-31", category: "Medicine" },
          { id: 2, title: "Medical Equipment Fund", currentAmount: 3000, totalAmount: 5000, dueDate: "2025-11-15", category: "Medicine" },
          { id: 3, title: "Healthcare for Children", currentAmount: 2000, totalAmount: 8000, dueDate: "2025-10-20", category: "Children" },
          { id: 4, title: "Emergency Medical Aid", currentAmount: 7500, totalAmount: 10000, dueDate: "2025-09-30", category: "Emergency" },
          { id: 5, title: "Medical Research Support", currentAmount: 1500, totalAmount: 5000, dueDate: "2025-12-01", category: "Research" },
          { id: 6, title: "Community Health Project", currentAmount: 4000, totalAmount: 7000, dueDate: "2025-11-10", category: "Community" },
          { id: 7, title: "Rural Healthcare Initiative", currentAmount: 2500, totalAmount: 6000, dueDate: "2025-10-05", category: "Community" },
          { id: 8, title: "Medical Training Program", currentAmount: 1000, totalAmount: 3000, dueDate: "2025-11-25", category: "Education" },
          { id: 9, title: "Healthcare Access Fund", currentAmount: 6000, totalAmount: 9000, dueDate: "2025-12-15", category: "Access" },
        ];

        const currentDate = new Date();
        const filteredDonations = mockDonations.filter(donation => {
          const donationDueDate = new Date(donation.dueDate);
          return donation.category === category && donationDueDate >= currentDate;
        });

        setTimeout(() => {
          setDonations(filteredDonations);
          setLoading(false);
        }, 1000);
      } catch (error) {
        setError('Failed to fetch donations');
        setLoading(false);
      }
    };

    fetchDonations();
  }, [category]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3182CE" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {donations.map((donation) => (
            <DonationCard
              key={donation.id}
              title={donation.title}
              currentAmount={donation.currentAmount}
              totalAmount={donation.totalAmount}
              dueDate={donation.dueDate}
              onPress={() => console.log(`Selected donation: ${donation.title}`)}
            />
          ))}
        </View>
      </ScrollView>
      <BottomNavBar navigation={navigation} activeScreen="Home" isAdmin={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContent: {
    paddingBottom: 80, // Ensure content doesn't overlap with the navbar
  },
  grid: {
    padding: 16,
    gap: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});