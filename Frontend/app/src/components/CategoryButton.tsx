import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CategoryButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.categoryButton} onPress={onPress}>
    <View style={styles.iconContainer}>
      {icon}
    </View>
    <Text style={styles.categoryLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  categoryButton: {
    marginTop: 16,
    width: '30%',
    aspectRatio: 1,
    marginBottom: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryLabel: {
    padding: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
    textAlign: 'center',
  },
});

export default CategoryButton;