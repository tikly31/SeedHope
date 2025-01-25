// apiUtils.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import CONFIG from "../screen/config";
import axios from "axios";

const API_BASE_URL = CONFIG.API_BASE_URL;

export const get_current_user = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch user:",
        response.status,
        response.statusText
      );
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }
};

// get user by id as path parameter

export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const user = await response.json();
    return user;
  }
  catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const passwordChecker = async (rawPassword) => {
  try {
    const token = await AsyncStorage.getItem("token"); // Retrieve the token from AsyncStorage
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(
      `${API_BASE_URL}/passwordChecker/${encodeURIComponent(rawPassword)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to check password");
    }
    // console.log("response + pass" , response);

    const isPasswordCorrect = await response.text(); // Assuming the response is a boolean
    // console.log("isPass", isPasswordCorrect);
    return isPasswordCorrect;
  } catch (error) {
    console.error("Error checking password:", error);
    throw error;
  }
};

export const getCampaignsByOrganizerId = async (organizerId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/campaigns/${organizerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch campaigns");
    }

    const campaigns = await response.json(); // Assuming the response is a JSON array
    return campaigns;
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
};

export const uploadCampaignImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/uploads/campaign`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload campaign image.");
    }

    const fileName = await response.text();
    return fileName; // This is the uploaded file's name
  } catch (error) {
    console.error("Error uploading campaign image:", error);
    return null;
  }
};

export const getDonationsByUserId = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/donation/me/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch donations");
    }

    const donations = await response.json(); // Assuming the response is a JSON array of donations
    return donations;
  } catch (error) {
    console.error("Error fetching donations:", error);
    throw error;
  }
};


export const uploadUserImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/uploads/user`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload user image.");
    }

    const fileName = await response.text();
    return fileName; // This is the uploaded file's name
  } catch (error) {
    console.error("Error uploading user image:", error);
    return null;
  }
};

export const updateCampaign = async (campaign) => {
  try {
    const response = await fetch(`${API_BASE_URL}/campaign/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(campaign),
    });
    return response.data;
  } catch (error) {
    console.error("Error updating campaign:", error);
    throw error;
  }

};

// get all pending campaigns

export const getPendingCampaigns = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/campaign/pending`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch campaigns");
    }

    const campaigns = await response.json(); // Assuming the response is a JSON array
    console.log("campaigns", campaigns);
    return campaigns;
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
};

export const createComment = async (commentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      throw new Error("Failed to create comment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const addReplyToComment = async (parentCommentId, replyData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/comments/add/${parentCommentId}/replies`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(replyData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add reply");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding reply:", error);
    throw error;
  }
};

export const getCommentsByCampaignId = async (campaignId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/comments/campaign/${campaignId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

/**
 * Fetch trending campaigns from the backend.
 * @param {string} apiUrl - The base URL of the backend API.
 * @param {number} days - Number of recent days to analyze trends (default: 7 days).
 * @returns {Promise<Object[]>} - A promise that resolves to an array of trending campaigns.
 */
export async function fetchTrendingCampaigns() {
  try {
    const response = await axios.get(`${API_BASE_URL}/campaign/trending`);

    if (response.status === 200) {
      return response.data; // Assuming API returns an array of trending campaigns
    } else {
      console.error("Failed to fetch trending campaigns:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching trending campaigns:", error.message);
    throw new Error("Could not fetch trending campaigns. Please try again later.");
  }
}

/**
 * Parse and format campaign data for display.
 * @param {Object[]} campaigns - Array of campaigns from the API.
 * @returns {Object[]} - Array of formatted campaign objects.
 */
export function formatTrendingCampaigns(campaigns) {
  return campaigns.map((campaign) => ({
    id: campaign.campaignId || campaign.id,
    title: campaign.title || "Unnamed Campaign",
    transactionCount: campaign.transactionCount || 0,
    ...campaign, // Include other fields returned from the backend if needed
  }));
}

export const uploadDocument = async (file) => {
  // Create a new FormData instance
  const formData = new FormData();

  // Append the file to the FormData object with the key 'file'
  formData.append("file", {
    uri: file.uri,
    name: file.name,
    type: file.type,
  });

  try {
    // Make a POST request to the '/uploads/document' endpoint
    const response = await fetch(`${CONFIG.API_BASE_URL}/uploads/document`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        // If your backend requires authentication, include the Authorization header
        // "Authorization": `Bearer ${await AsyncStorage.getItem('authToken')}`,
      },
    });

    // Check if the response status is OK (200-299)
    if (!response.ok) {
      // Optionally, parse the error message from the response
      const errorMessage = await response.text();
      throw new Error(`Failed to upload document: ${errorMessage}`);
    }

    // Assuming the backend returns the file name as plain text
    const fileName = await response.text();
    return fileName; // This is the uploaded file's name
  } catch (error) {
    // Log the error to the console for debugging
    console.error("Error uploading document:", error);
    return null; // Return null to indicate failure
  }
};