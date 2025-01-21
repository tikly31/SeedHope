import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface FundraiserCardProps {
  id: string;
  title: string;
  amount: string;
  onPress: (id: string) => void;
}

const FundraiserCard: React.FC<FundraiserCardProps> = ({ id, title, amount, onPress }) => (
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

const styles = StyleSheet.create({
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
});

export default FundraiserCard;