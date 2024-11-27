import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FeaturedProject from '../components/FeaturedProject';

const { width } = Dimensions.get('window');

const ProjectCard = ({ title, description, progress }) => (
  <View style={styles.projectCard}>
    <Image
      source={{ uri: 'https://picsum.photos/200/100' }}
      style={styles.projectImage}
    />
    <View style={styles.projectContent}>
      <Text style={styles.projectTitle}>{title}</Text>
      <Text style={styles.projectDescription}>{description}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{progress}% funded</Text>
    </View>
  </View>
);

const MainScreen = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const featuredProjects = [
    {
      id: '1',
      title: 'Save the Rainforest',
      description: 'Help us protect 1000 acres of rainforest',
      progress: 70,
      imageUrl: 'https://picsum.photos/400/200',
    },
    {
      id: '2',
      title: 'Clean Energy Initiative',
      description: 'Fund solar panels for 100 homes',
      progress: 55,
      imageUrl: 'https://picsum.photos/400/201',
    },
    {
      id: '3',
      title: 'Ocean Cleanup',
      description: 'Remove 1000 tons of plastic from the ocean',
      progress: 40,
      imageUrl: 'https://picsum.photos/400/202',
    },
  ];

  const ongoingProjects = [
    { id: '4', title: "Clean Ocean Initiative", description: "Remove plastic from our oceans", progress: 45 },
    { id: '5', title: "Urban Garden Project", description: "Create green spaces in the city", progress: 60 },
    { id: '6', title: "Renewable Energy Fund", description: "Invest in solar and wind power", progress: 30 },
  ];

  const allProjects = [...featuredProjects, ...ongoingProjects];

  const filteredProjects = useCallback(() => {
    if (!searchQuery) return allProjects;
    return allProjects.filter(project => 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {isSearchVisible ? (
          <TextInput
            style={styles.searchInput}
            placeholder="Search projects..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        ) : (
          <Text style={styles.headerTitle}>CrowdFund</Text>
        )}
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleSearch}>
            <MaterialCommunityIcons name={isSearchVisible ? "close" : "magnify"} size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {!searchQuery && (
          <>
            <Text style={styles.sectionTitle}>Featured Projects</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredProjectsContainer}>
              {featuredProjects.map((project) => (
                <FeaturedProject key={project.id} {...project} />
              ))}
            </ScrollView>
          </>
        )}
        
        <Text style={styles.sectionTitle}>{searchQuery ? 'Search Results' : 'Ongoing Projects'}</Text>
        {filteredProjects().map((project) => (
          <ProjectCard key={project.id} title={project.title} description={project.description} progress={project.progress} />
        ))}
      </ScrollView>
      
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="home" size={24} color="black" />
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="compass" size={24} color="black" />
          <Text>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="plus-circle" size={24} color="black" />
          <Text>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="account" size={24} color="black" />
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 16,
  },
  featuredProjectsContainer: {
    paddingLeft: 16,
  },
  projectCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  projectImage: {
    width: 100,
    height: 100,
  },
  projectContent: {
    flex: 1,
    padding: 12,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 12,
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    alignItems: 'center',
  },
});

export default MainScreen;

