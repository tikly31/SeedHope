import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import BottomNavBar from '../components/BottomNavBar';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { get_current_user } from '../utils/apiUtils';

import CONFIG from './config';
const API_BASE_URL = CONFIG.API_BASE_URL;
// const API_BASE_URL = 'http://192.168.0.106:8080';

interface FundraiserDetailsProps {
  route: {
    params: {
      fundId: number;
    };
  };
}

export default function FundraiserDetailsScreen({ route }: FundraiserDetailsProps) {
  const { fundId } = route.params;
  const navigation = useNavigation();

  // console.log('Here with fundId:', fundId);

  const [fundraiser, setFundraiser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentUser, setCurrentUser] = useState(null);

    const fetchFundraiserDetails = async () => {
      try {
        console.log('Making API call with fundId:', fundId);
        const response = await axios.get(`${API_BASE_URL}/campaign/${fundId}`);
        console.log('API Response:', response.data);
        setFundraiser(response.data);
        const user = await get_current_user();
        setCurrentUser(user);
      } catch (err) {
        console.error('Error fetching fundraiser details:', err);
        setError('Failed to load fundraiser details.');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (!fundId) {
        console.log('Invalid fundId:', fundId);
        return; // Exit early if fundId is not valid
      }

  

      fetchFundraiserDetails();
    }, [fundId]);

    useFocusEffect(
      useCallback(() => {
        fetchFundraiserDetails();
      }, [fundId])
    );

     // Handle loading state and error
      if (loading) {
        return (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text>Loading fundraiser details...</Text>
          </View>
        );
      }

      if (error) {
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        );
      }

      if (!fundraiser) {
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Fundraiser not found.</Text>
          </View>
        );
      }



  const progress = (fundraiser.raisedAmount / fundraiser.goalAmount) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* Fundraiser Image */}
        <Image source={fundraiser.photoUrl ? {uri : `${API_BASE_URL}/campaigns/${fundraiser.photoUrl}`} :{ uri: 'https://picsum.photos/200/300' }} style={styles.image} />

        <View style={styles.content}>
          {/* Fundraiser Title and Due Date */}
          <View style={styles.header}>
            <Text style={styles.title}>{fundraiser.title}</Text>
            <Text style={styles.dueDate}>Due: {fundraiser.dueDate}</Text>
          </View>

          {/* Raised Amount and Required Amount */}
          <View style={styles.amountsContainer}>
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Raised Amount</Text>
              <Text style={styles.amount}>${fundraiser.raisedAmount.toLocaleString()}</Text>
            </View>
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Goal Amount</Text>
              <Text style={styles.amount}>${fundraiser.goalAmount.toLocaleString()}</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>

          {/* Description and Urgent Tag */}
          <View style={styles.descriptionContainer}>
            {fundraiser.isUrgent && (
              <View style={styles.urgentTag}>
                <Text style={styles.urgentText}>URGENT</Text>
              </View>
            )}
            <Text style={styles.description}>{fundraiser.description}</Text>
          </View>
          {

          currentUser.id === fundraiser.organizerId ?  
        (
          // Edit Event Button
          <TouchableOpacity style={styles.donateButton}
            onPress={() => navigation.navigate('EditFundraiserScreen', {fundraiser})}
          >
            <Text style={styles.donateButtonText}>Edit Fundraiser</Text>
          </TouchableOpacity>
        )

        : 
        
        ( 
          <>
              <TouchableOpacity style={styles.donateButton}
                  onPress={() => navigation.navigate('DonationPage', {fundId})}
                >
                <Text style={styles.donateButtonText}>Donate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentButton} onPress={() => navigation.navigate("CommentScreen", { fundId })}>
                  <Ionicons name="chatbubble-outline" size={24} color="#fff" /> 
                  <Text style={styles.commentButtonText}>Comments</Text> 
               </TouchableOpacity> 
            </>
        )
        }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 8,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  dueDate: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 6,
  },
  amountsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  amountBox: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  urgentTag: {
    backgroundColor: "#FF5252",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 10,
  },
  urgentText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },
  donateButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  donateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  commentButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  commentButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
});