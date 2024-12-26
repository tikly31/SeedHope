import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Home, Compass, PlusCircle, User } from 'lucide-react';

interface BottomNavBarProps {
  navigation: any;
  activeScreen: 'Home' | 'Explore' | 'Create' | 'Profile';
}

export default function BottomNavBar({ navigation, activeScreen }: BottomNavBarProps) {
  const navItems = [
    { name: 'Home', icon: Home },
    { name: 'Explore', icon: Compass },
    { name: 'Create', icon: PlusCircle },
    { name: 'Profile', icon: User },
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.name)}
          >
            <Icon
              size={24}
              color={activeScreen === item.name ? '#2196F3' : '#666'}
            />
            <Text
              style={[
                styles.navText,
                activeScreen === item.name && styles.navTextActive,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
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

