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