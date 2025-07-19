import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.2.35:5112'; 

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Voeg JWT-token toe aan elke request indien aanwezig
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getNotifications = () => api.get('/notification');
export const markNotificationAsRead = (id: string) => api.post(`/notification/read/${id}`);
export const saveExpoPushToken = (ExpoPushToken: string) => api.post('/auth/profile/expo-token', { ExpoPushToken });

export default api; 