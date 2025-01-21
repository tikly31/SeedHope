import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


interface BottomNavBarProps {
  navigation: any;
  activeScreen: 'MainScreen1' | 'ExploreScreen' | 'Create' | 'Profile' | 'PostList';
  isAdmin ?: boolean;
}

export default function BottomNavBar({ navigation, activeScreen, isAdmin = false }: BottomNavBarProps) {
  const navItems = [
    { name: 'MainScreen', label: 'Home', icon: 'home-outline' },
    { name: 'ExploreScreen', label: 'Explore', icon: 'compass-outline' },
    isAdmin 
      ? { name: 'PostListScreen', label: 'Approve', icon: 'checkmark-circle-outline' }
      : { name: 'CreateFundraiser', label: 'Create', icon: 'add-circle-outline' },
    { name: 'ProfileScreen', label: 'Profile', icon: 'person-outline' },
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.navItem}
          onPress={() => navigation.navigate(item.name)}
        >
          <Ionicons
            name={item.icon}
            size={24}
            color={activeScreen === item.name ? '#2196F3' : '#666'}
          />
          <Text
            style={[
              styles.navText,
              activeScreen === item.name && styles.navTextActive,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  navTextActive: {
    color: '#2196F3',
  },
});
