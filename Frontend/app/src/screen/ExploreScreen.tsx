import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';


interface CategoryButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

const CategoryButton = ({ icon, label, onPress }: CategoryButtonProps) => (
  <TouchableOpacity style={styles.categoryButton} onPress={onPress}>
    <View style={styles.iconContainer}>
      {icon}
    </View>
    <Text style={styles.categoryLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function ExploreScreen({ navigation }) {
  const categories = [
    { icon: <Ionicons name="book-outline" size={32} color="#4A5568" />, label: 'Education' },
    { icon: <Ionicons name="people-outline" size={32} color="#4A5568" />, label: 'Children' },
    { icon: <Ionicons name="medkit-outline" size={32} color="#4A5568" />, label: 'Medicine' },
    { icon: <Ionicons name="cloud-outline" size={32} color="#4A5568" />, label: 'Disaster' },
    { icon: <Ionicons name="tree-outline" size={32} color="#4A5568" />, label: 'Environment' },
    { icon: <Ionicons name="alarm-outline" size={32} color="#4A5568" />, label: 'Emergency' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Categories</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.grid}>
          {categories.map((category, index) => (
            <CategoryButton
              key={index}
              icon={category.icon}
              label={category.label}
              onPress={() => console.log(`Selected ${category.label}`)}
            />
          ))}
        </View>
      </ScrollView>
    <BottomNavBar navigation={navigation} activeScreen="Home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
    padding: 20,
    paddingBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  categoryButton: {
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
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
    textAlign: 'center',
  },
});
