import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import default_contributor from '../assets/default_contributor.jpg'; // Ensure this path is correct

interface ContributorCircleProps {
  image: string;
  name: string;
}

const ContributorCircle: React.FC<ContributorCircleProps> = ({ image, name }) => {
  // Check if the image is a valid URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <TouchableOpacity style={styles.contributorContainer}>
      <Image
        source={
          isValidUrl(image)
            ? { uri: image }
            : default_contributor // Use the imported image directly
        }
        style={styles.contributorImage}
      />
      <Text style={styles.contributorName} numberOfLines={1}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contributorContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  contributorImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  contributorName: {
    fontSize: 12,
    marginTop: 4,
    maxWidth: 60,
    textAlign: 'center',
  },
});

export default ContributorCircle;