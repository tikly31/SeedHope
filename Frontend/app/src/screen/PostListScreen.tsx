import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import BottomNavBar from '../components/BottomNavBar';
interface Post {
  id: string;
  title: string;
  summary: string;
}

const DUMMY_POSTS: Post[] = [
  {
    id: '1',
    title: 'First Post',
    summary: 'This is a summary of the first post...',
  },
  {
    id: '2',
    title: 'Second Post',
    summary: 'This is a summary of the second post...',
  },
];

export default function PostListScreen({ navigation }) {
  const handleApprove = (id: string) => {
    // Handle approve logic
    console.log('Approved post:', id);
  };

  const handleReject = (id: string) => {
    // Handle reject logic
    console.log('Rejected post:', id);
  };

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.summary} numberOfLines={2}>
          {item.summary}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.detailsButton]}
          onPress={() => navigation.navigate('PostDetails', { postId: item.id })}
        >
          <Text style={styles.buttonText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.approveButton]}
          onPress={() => handleApprove(item.id)}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleReject(item.id)}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DUMMY_POSTS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <BottomNavBar navigation={navigation} activeScreen="Home"/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postContent: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: '#4a90e2',
  },
  approveButton: {
    backgroundColor: '#2ecc71',
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
  },
});

