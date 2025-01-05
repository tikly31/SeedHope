import axios from 'axios';

const API_BASE_URL = 'http://10.42.0.46:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});