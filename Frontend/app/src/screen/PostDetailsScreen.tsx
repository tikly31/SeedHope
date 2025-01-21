import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export default function PostDetailsScreen({ route, navigation }) {
  const { postId } = route.params;

  const handleApprove = () => {
    // Handle approve logic
    console.log('Approved post:', postId);
    navigation.goBack();
  };

  const handleReject = () => {
    // Handle reject logic
    console.log('Rejected post:', postId);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: 'https://via.placeholder.com/400x300' }}
          style={styles.image}
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.label}>Title</Text>
              <Text style={styles.title}>Sample Post Title</Text>
            </View>
            <View style={styles.dueContainer}>
              <Text style={styles.label}>Due</Text>
              <Text style={styles.dueDate}>2024-01-15</Text>
            </View>
          </View>
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.description}>
              This is a detailed description of the post. It contains all the necessary
              information that an admin would need to make a decision about approving
              or rejecting this post. The description can be quite long and will be
              scrollable within the screen.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={handleReject}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.approveButton]}
          onPress={handleApprove}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  titleContainer: {
    flex: 2,
    marginRight: 16,
  },
  dueContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dueDate: {
    fontSize: 16,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  approveButton: {
    backgroundColor: '#2ecc71',
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
  },
});

