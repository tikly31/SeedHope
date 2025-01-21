import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import FundraiserCard from './FundraiserCard'; // Adjust the path as necessary

interface FundraiserSectionProps {
  title: string;
  data: Array<{ id: string; title: string; amount: string }>;
  onPressFundraiser: (id: string) => void;
}

const FundraiserSection: React.FC<FundraiserSectionProps> = ({ title, data, onPressFundraiser }) => (
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
    marginBottom: 12,
  },
});

export default FundraiserSection;