import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import FundraiserItem from './FundraiserItem'; // Adjust the path as necessary

interface Fundraiser {
  id: string;
  title: string;
  raisedAmount: number; // Assuming raisedAmount is a number
  goalAmount: number; // Assuming goalAmount is a number
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
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <FundraiserItem
          item={item}
          onPress={() => onPressFundraiser(item.id)} // Pass the id to the onPress function
        />
      )}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.fundraiserList}
    />
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
});

export default FundraiserSection;