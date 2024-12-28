import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
// import { Heart } from 'lucide-react-native';

interface DonationCardProps {
  title: string;
  onPress: () => void;
}

const DonationCard = ({ title, onPress }: DonationCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <TouchableOpacity style={styles.donateButton}>
        <Text style={styles.donateButtonText}>Donate</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

export default function CategoryScreen({ route }) {
  const { category } = route.params;
  console.log(`Selected category: ${category}`);
  
  // Mock data - replace with your actual data
  const donations = [
    { id: 1, title: "Support Local Hospital" },
    { id: 2, title: "Medical Equipment Fund" },
    { id: 3, title: "Healthcare for Children" },
    { id: 4, title: "Emergency Medical Aid" },
    { id: 5, title: "Medical Research Support" },
    { id: 6, title: "Community Health Project" },
    { id: 7, title: "Rural Healthcare Initiative" },
    { id: 8, title: "Medical Training Program" },
    { id: 9, title: "Healthcare Access Fund" },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {donations.map((donation) => (
          <DonationCard
            key={donation.id}
            title={donation.title}
            onPress={() => console.log(`Selected donation: ${donation.title}`)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  grid: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    flex: 1,
    marginRight: 12,
  },
  donateButton: {
    backgroundColor: '#4299E1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  donateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});