import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/api';

// Créer l'instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Avant chaque requête : ajouter le token automatiquement
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si le token expire : essayer de le renouveler automatiquement
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = await AsyncStorage.getItem('refresh_token');
        const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh });
        await AsyncStorage.setItem('access_token', res.data.access);
        original.headers.Authorization = `Bearer ${res.data.access}`;
        return api(original);
      } catch {
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
      }
    }
    return Promise.reject(error);
  }
);

export default api;