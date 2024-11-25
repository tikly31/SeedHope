import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface FeaturedProjectProps {
  title: string;
  description: string;
  progress: number;
  imageUrl: string;
}

const FeaturedProject: React.FC<FeaturedProjectProps> = ({ title, description, progress, imageUrl }) => (
  <View style={styles.featuredProject}>
    <Image
      source={{ uri: imageUrl }}
      style={styles.featuredImage}
    />
    <View style={styles.featuredContent}>
      <Text style={styles.featuredTitle}>{title}</Text>
      <Text style={styles.featuredDescription}>{description}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{progress}% funded</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  featuredProject: {
    width: width - 32,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 16,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 200,
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 8,
  },
  progress: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
});

export default FeaturedProject;

