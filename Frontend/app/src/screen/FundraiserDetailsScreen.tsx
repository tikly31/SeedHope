import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { get_current_user } from "../utils/apiUtils";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { Share } from "react-native";

import CONFIG from "./config";
const API_BASE_URL = CONFIG.API_BASE_URL;

const PLACEHOLDER_IMAGE = "https://picsum.photos/200/300";

interface Fundraiser {
  id: number;
  title: string;
  description: string;
  photoUrl?: string;
  goalAmount: number;
  raisedAmount: number;
  dueDate: string;
  isUrgent: boolean;
  organizerId: number;
}

interface FundraiserDetailsProps {
  route: {
    params: {
      fundId: number;
    };
  };
}

export default function FundraiserDetailsScreen({
  route,
}: FundraiserDetailsProps) {
  const { fundId } = route.params;
  const navigation = useNavigation();

  const [fundraiser, setFundraiser] = useState<Fundraiser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const fetchFundraiserDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/campaign/${fundId}`);
      setFundraiser(response.data);

      const user = await get_current_user();
      setCurrentUser(user);
    } catch (err) {
      console.error("Error fetching fundraiser details:", err);
      setError("Failed to load fundraiser details.");
    } finally {
      setLoading(false);
    }
  };

  const shareFundraiser = async () => {
    if (!fundraiser) return;

    try {
      const shareMessage =
        `Check out this fundraiser: ${fundraiser.title}\n\n` +
        `Goal: $${fundraiser.goalAmount.toLocaleString()}\n` +
        `Description: ${fundraiser.description}\n\n` +
        `Donate now at SeedHope!`;

      const result = await Share.share({
        message: shareMessage,
        url:
          fundraiser.photoUrl
            ? fundraiser.photoUrl
            : undefined,
        title: `Support ${fundraiser.title}!`,
      });

      if (result.action === Share.sharedAction) {
        console.log("Fundraiser shared successfully.");
      } else if (result.action === Share.dismissedAction) {
        console.log("User dismissed the sharing dialog.");
      }
    } catch (error) {
      console.error("Error sharing fundraiser:", error);
      Alert.alert(
        "Sharing Error",
        "Unable to share fundraiser. Please try again later."
      );
    }
  };

  useEffect(() => {
    if (!fundId) {
      console.log("Invalid fundId:", fundId);
      return;
    }

    fetchFundraiserDetails();
  }, [fundId]);

  useFocusEffect(
    useCallback(() => {
      fetchFundraiserDetails();
    }, [fundId])
  );

  // Loading State
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text>Loading fundraiser details...</Text>
      </View>
    );
  }

  // Error State
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchFundraiserDetails}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // No Fundraiser State
  if (!fundraiser) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Fundraiser not found.</Text>
      </View>
    );
  }

  // Image source selection
  const getImageSource = () => {
    if (fundraiser.photoUrl) {
      return { uri: `${API_BASE_URL}/campaigns/${fundraiser.photoUrl}` };
    }
    return { uri: PLACEHOLDER_IMAGE };
  };

  // Progress calculation
  const progress = Math.min(
    (fundraiser.raisedAmount / fundraiser.goalAmount) * 100,
    100
  );

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
          source={getImageSource()}
          style={styles.image}
          onError={(e) => {
            console.warn("Image load error", e.nativeEvent.error);
          }}
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{fundraiser.title}</Text>
            <Text style={styles.dueDate}>Due: {fundraiser.dueDate}</Text>
          </View>

          <View style={styles.amountsContainer}>
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Raised Amount</Text>
              <Text style={styles.amount}>
                ${fundraiser.raisedAmount.toLocaleString()}
              </Text>
            </View>
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Goal Amount</Text>
              <Text style={styles.amount}>
                ${fundraiser.goalAmount.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>

          <View style={styles.descriptionContainer}>
            {fundraiser.isUrgent && (
              <View style={styles.urgentTag}>
                <Text style={styles.urgentText}>URGENT</Text>
              </View>
            )}
            <Text style={styles.description}>{fundraiser.description}</Text>
          </View>

          {currentUser.id === fundraiser.organizerId ? (
            <TouchableOpacity
              style={styles.donateButton}
              onPress={() =>
                navigation.navigate("EditFundraiserScreen", { fundraiser })
              }
            >
              <Text style={styles.donateButtonText}>Edit Fundraiser</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.donateButton}
                onPress={() => navigation.navigate("DonationPage", { fundId })}
              >
                <Text style={styles.donateButtonText}>Donate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.commentButton}
                onPress={() => navigation.navigate("CommentScreen", { fundId })}
              >
                <Ionicons name="chatbubble-outline" size={24} color="#fff" />
                <Text style={styles.commentButtonText}>Comments</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={shareFundraiser}
              >
                <Ionicons name="share-social-outline" size={24} color="#fff" />
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </>
          )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
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
  shareButton: {
    backgroundColor: "#FF9800",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
