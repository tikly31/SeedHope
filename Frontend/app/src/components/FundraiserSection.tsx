import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import FundraiserCard from './FundraiserCard'; // Adjust the path as necessary
import CONFIG from '../screen/config';
const API_BASE_URL = CONFIG.API_BASE_URL; // Import the API_BASE_URL from the config file
interface Fundraiser {
  id: string;
  title: string;
  raisedAmount: number; // Assuming raisedAmount is a number
  goalAmount: string; // Assuming goalAmount is a number
  dueDate: string; // Assuming dueDate is a string
  photoUrl: string; // Assuming photoUrl is a string
}

interface FundraiserSectionProps {
  title: string;
  data: Fundraiser[]; // Update the data type to include the new Fundraiser type
  onPressFundraiser: (id: string) => void;
}

const FundraiserSection: React.FC<FundraiserSectionProps> = ({ title, data, onPressFundraiser }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {data.length === 0 ? (
      <Text style={styles.noDataText}>No fundraisers available.</Text>
    ) : (
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <FundraiserCard
            id={item.id}
            title={item.title}
            amount={item.goalAmount} // Format the amount string
            imageUri={item.photoUrl ? item.photoUrl : "https://via.placeholder.com/400x300.png?text=Loading..."} // Use photoUrl for the image
            onPress={onPressFundraiser} // Pass the onPress function
          />
        )}
        keyExtractor={item => item.id}
        horizontal // Enable horizontal scrolling
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.fundraiserList}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
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
    paddingBottom: 12,
  },
  noDataText: {
    marginLeft: 16,
    fontSize: 14,
    color: '#999',
  },
});

export default FundraiserSection;