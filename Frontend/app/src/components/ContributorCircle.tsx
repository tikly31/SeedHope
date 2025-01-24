import React from "react";
import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import CONFIG from "../screen/config"; // Ensure CONFIG has the API base URL
const default_contributor = require("../assets/default_contributor.jpg");
// Import default image

const API_BASE_URL = CONFIG.API_BASE_URL; // Assuming API_BASE_URL is correctly set

interface ContributorCircleProps {
  image: string; // Image file name
  name: string;
}

const ContributorCircle: React.FC<ContributorCircleProps> = ({
  image,
  name,
}) => {
  // Construct the full image URL for uploaded images
  const imageUrl = `${API_BASE_URL}/user/${image}`;

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
          isValidUrl(imageUrl) ? { uri: imageUrl } : default_contributor // Fallback to default image
        }
        style={styles.contributorImage}
      />
      <Text style={styles.contributorName} numberOfLines={1}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contributorContainer: {
    alignItems: "center",
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
    textAlign: "center",
  },
});

export default ContributorCircle;
