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
    { icon: <Ionicons name="medkit-outline" size={32} color="#4A5568" />, label: 'Medical' },
    { icon: <Ionicons name="cloud-outline" size={32} color="#4A5568" />, label: 'Disaster' },
    { icon: <Ionicons name="leaf-outline" size={32} color="#4A5568" />, label: 'Environment' },
    { icon: <Ionicons name="alarm-outline" size={32} color="#4A5568" />, label: 'Emergency' },
    { icon: <Ionicons name="ellipsis-horizontal-outline" size={32} color="#4A5568" />, label: 'Other' }, // New category
  ];

  // Helper function to group categories into rows of two
  const groupedCategories = categories.reduce((rows, category, index) => {
    if (index % 2 === 0) rows.push([]);
    rows[rows.length - 1].push(category);
    return rows;
  }, [] as Array<Array<{ icon: React.ReactNode; label: string }>>);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Categories</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {groupedCategories.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((category, colIndex) => (
              <CategoryButton
                key={colIndex}
                icon={category.icon}
                label={category.label}
                onPress={() => navigation.navigate('CategoryScreen', { category: category.label.toLowerCase()})}
              />
            ))}
          </View>
        ))}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
});
