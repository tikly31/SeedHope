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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { get_current_user, getUserById, getCampaignById } from "../utils/apiUtils";
import { Share } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import CONFIG from "./config";
import profile from "../assets/profile.jpg";
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
  const [authorName, setAuthorName] = useState<string>("");
  const [authorImage, setAuthorImage] = useState(profile);
  const [userId, setUserId] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  // const [user, setUser] = useState<any>(null);

  const buttonScale = useSharedValue(1);

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
      const response = await getCampaignById(fundId);
      setFundraiser(response);
      console.log("Fundraiser:", response);

      const user = await getUserById(response.organizerId);
      const currentUser = await get_current_user();
      setUser(currentUser);
    
      setCurrentUser(user);
      setAuthorName(user.name);
      setUserId(user.id);
      setAuthorImage(user.picture ? { uri: `${API_BASE_URL}/user/${user.picture}` } : profile);
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
      Alert.alert("Sharing Error", "Unable to share fundraiser. Please try again later.");
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

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.9, { damping: 5 });
  };

  const handleDonatePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 5 });
    navigation.navigate("DonationPage", { fundId });
  };

  const handleEditPressOut = () => {
    buttonScale.value = withSpring(1, { damping: 5 });
    navigation.navigate("EditFundraiserScreen", {fundraiser});
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text>Loading fundraiser details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchFundraiserDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!fundraiser) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Fundraiser not found.</Text>
      </View>
    );
  }

  const getImageSource = () => {
    if (fundraiser.photoUrl) {
      return { uri: `${API_BASE_URL}/campaigns/${fundraiser.photoUrl}` };
    }
    return { uri: PLACEHOLDER_IMAGE };
  };

  const progress = Math.min((fundraiser.raisedAmount / fundraiser.goalAmount) * 100, 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Image source={getImageSource()} style={styles.image} />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{fundraiser.title}</Text>
            <Text style={styles.dueDate}>Due: {new Date(fundraiser.dueDate).toLocaleDateString("en-BD", { day: "numeric", month: "long", year: "numeric" })}
            </Text>
          </View>

          <View style={styles.amountsContainer}>
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Raised Amount</Text>
              <Text style={styles.amount}>৳{fundraiser.raisedAmount.toLocaleString()}</Text>
            </View>
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Goal Amount</Text>
              <Text style={styles.amount}>৳{fundraiser.goalAmount.toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <View style={styles.authorContainer}>
            <View style={styles.authorInfo}>
              <TouchableOpacity onPress = {() => navigation.navigate("ProfileScreen2", { userId: userId })}>
                <Image
                  source={authorImage} // Placeholder for author profile image
                  style={styles.profileImage}
                />
              </TouchableOpacity>
              
              <View style={styles.authorDetails}>
                <Text style={styles.authorName}>{authorName}</Text>
                {/* <Text style={styles.authorId}></Text> */}
                {/* Displaying author ID */}
              </View>
            </View>
          </View>
          <View style={styles.descriptionContainer}>
            {fundraiser.isUrgent && (
              <View style={styles.urgentTag}>
                <Text style={styles.urgentText}>URGENT</Text>
              </View>
            )}
            <Text style={styles.description}>{fundraiser.description}</Text>
          </View>
          {user.id === fundraiser.organizerId ? (
          
            <Animated.View style={[styles.donateButtonContainer, animatedButtonStyle]}>
                {/* <Text>{currentUser.id} {fundraiser.organizerId}</Text> */}
              <TouchableOpacity onPressIn={handlePressIn} onPressOut={handleEditPressOut}>
                <LinearGradient colors={["#1aa", "#1aa"]} style={styles.gradientButton}>
                  <Ionicons name="create-outline" size={24} color="#fff" />
                  <Text style={styles.donateButtonText}>Edit</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ) : (
              <Animated.View style={[styles.donateButtonContainer, animatedButtonStyle]}>
                <TouchableOpacity onPressIn={handlePressIn} onPressOut={handleDonatePressOut}>
                  <LinearGradient colors={["#1aa", "#1aa"]} style={styles.gradientButton}>
                    <Ionicons name="cash-outline" size={24} color="#fff" />
                    <Text style={styles.donateButtonText}>Donate</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.commentButton]}
              onPress={() => navigation.navigate("CommentScreen", { fundId })}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
              <Text style={styles.buttonText}>Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.shareButton]}
              onPress={shareFundraiser}
            >
              <Ionicons name="share-social-outline" size={24} color="#fff" />
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
          </View>
          
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
    color: "#1aa",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  commentButton: {
    backgroundColor: "#4e9fe5",
  },
  shareButton: {
    backgroundColor: "#87c6eb",
  },
  donateButtonContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    width: 200,
  },
  donateButtonText: {
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
  authorContainer: {
    marginBottom: 16,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  authorDetails: {
    flexDirection: "column",
  },
  authorName: {
    fontSize: 16,
    fontWeight: "500",
  },
  authorId: {
    paddingLeft: 4,
    fontSize: 14,
    color: "#666",
  },
});
