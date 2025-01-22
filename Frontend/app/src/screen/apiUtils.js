// apiUtils.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from './config';

const API_BASE_URL = CONFIG.API_BASE_URL;

export const get_current_user = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch user:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error.message);
    return null;
  }
};


export const passwordChecker = async (rawPassword) => {
  try {
    const token = await AsyncStorage.getItem('token'); // Retrieve the token from AsyncStorage
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/passwordChecker/${encodeURIComponent(rawPassword)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the token in the request headers
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check password');
    }
    // console.log("response + pass" , response);

    const isPasswordCorrect = await response.text(); // Assuming the response is a boolean
    // console.log("isPass", isPasswordCorrect);
    return isPasswordCorrect;
  } catch (error) {
    console.error('Error checking password:', error);
    throw error;
  }
};


export const getCampaignsByOrganizerId = async (organizerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/campaigns/${organizerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch campaigns');
    }

    const campaigns = await response.json(); // Assuming the response is a JSON array
    return campaigns;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};



// export const getDonationsOfAUser = async (customerInfo) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/api/v1/campaigns/${encodeURIComponent(customerInfo)}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch donations');
//     }

//     const donations = await response.json(); // Assuming the response is a JSON array
//     return donations;
//   } catch (error) {
//     console.error('Error fetching donations:', error);
//     throw error;
//   }
// };