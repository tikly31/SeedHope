import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';
import { useNavigation } from '@react-navigation/native';
import CategoryButton from '../components/CategoryButton';

export default function ExploreScreen() {
  const navigation = useNavigation();

  const categories = [
    { icon: <Ionicons name="book-outline" size={32} color="#4A5568" />, label: 'Education' },
    { icon: <Ionicons name="people-outline" size={32} color="#4A5568" />, label: 'Children' },
    { icon: <Ionicons name="medkit-outline" size={32} color="#4A5568" />, label: 'Medicine' },
    { icon: <Ionicons name="cloud-outline" size={32} color="#4A5568" />, label: 'Disaster' },
    { icon: <Ionicons name="tree-outline" size={32} color="#4A5568" />, label: 'Environment' },
    { icon: <Ionicons name="alarm-outline" size={32} color="#4A5568" />, label: 'Emergency' },
    { icon: <Ionicons name="ellipsis-horizontal-outline" size={32} color="#4A5568" />, label: 'Other' }, // New category
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
              onPress={() => navigation.navigate('CategoryScreen', { category: category.label })}
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
});