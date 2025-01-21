import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface FundraiserDetailsProps {
  route: {
    params: {
      fundId: string;
    };
  };
}

export default function FundraiserDetailsScreen({ route }: FundraiserDetailsProps) {
  const { fundId } = route.params;
  const navigation = useNavigation();

  // Mock data - replace with actual API call using fundId
  const fundraiser = {
    id: fundId,
    title: "Emergency Medical Equipment",
    dueDate: "2024-01-31", // ISO format
    raisedAmount: 15000,
    requiredAmount: 50000,
    description: "Urgent funding needed for essential medical equipment in rural areas. This initiative aims to provide basic healthcare facilities to underserved communities.",
    imageUrl: "https://placeholder.com/medical-equipment",
  };

  // Calculate if it's urgent based on the current date and due date
  const currentDate = new Date();
  const dueDate = new Date(fundraiser.dueDate);
  const remainingTime = (dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24); // in days
  const isUrgent = remainingTime <= 3;

  const progress = (fundraiser.raisedAmount / fundraiser.requiredAmount) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Image 
          source={{ uri: fundraiser.imageUrl }} 
          style={styles.image}
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{fundraiser.title}</Text>
            <Text style={styles.dueDate}>Due: {fundraiser.dueDate}</Text>
          </View>

          <View style={styles.amountsContainer}>
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Raised Amount</Text>
              <Text style={styles.amount}>${fundraiser.raisedAmount.toLocaleString()}</Text>
            </View>
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Required Amount</Text>
              <Text style={styles.amount}>${fundraiser.requiredAmount.toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>

          <View style={styles.descriptionContainer}>
            {isUrgent && (
              <View style={styles.urgentTag}>
                <Text style={styles.urgentText}>URGENT</Text>
              </View>
            )}
            <Text style={styles.description}>{fundraiser.description}</Text>
          </View>

          <TouchableOpacity style={styles.donateButton}>
            <Text style={styles.donateButtonText}>Donate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 8,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 6,
  },
  amountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amountBox: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  urgentTag: {
    backgroundColor: '#FF5252',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 10,
  },
  urgentText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  donateButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  donateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
