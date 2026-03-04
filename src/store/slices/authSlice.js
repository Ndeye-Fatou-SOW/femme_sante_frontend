import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/api';

// Action : Inscription
export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post(ENDPOINTS.REGISTER, data);
    await AsyncStorage.setItem('access_token', res.data.access);
    await AsyncStorage.setItem('refresh_token', res.data.refresh);
    await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { error: 'Erreur réseau' });
  }
});

// Action : Connexion
export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post(ENDPOINTS.LOGIN, data);
    await AsyncStorage.setItem('access_token', res.data.access);
    await AsyncStorage.setItem('refresh_token', res.data.refresh);
    await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { error: 'Erreur réseau' });
  }
});

// Action : Déconnexion
export const logout = createAsyncThunk('auth/logout', async (_, { getState }) => {
  const refresh = await AsyncStorage.getItem('refresh_token');
  try { await api.post(ENDPOINTS.LOGOUT, { refresh }); } catch {}
  await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
});

// Action : Charger l'utilisateur depuis le stockage local
export const loadUser = createAsyncThunk('auth/loadUser', async () => {
  const user = await AsyncStorage.getItem('user');
  const token = await AsyncStorage.getItem('access_token');
  if (user && token) return JSON.parse(user);
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (s) => { s.loading = true; s.error = null; });
    builder.addCase(register.fulfilled, (s, a) => {
      s.loading = false; s.user = a.payload.user; s.isAuthenticated = true;
    });
    builder.addCase(register.rejected, (s, a) => {
      s.loading = false; s.error = a.payload;
    });
    // Login
    builder.addCase(login.pending, (s) => { s.loading = true; s.error = null; });
    builder.addCase(login.fulfilled, (s, a) => {
      s.loading = false; s.user = a.payload.user; s.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (s, a) => {
      s.loading = false; s.error = a.payload;
    });
    // Logout
    builder.addCase(logout.fulfilled, (s) => {
      s.user = null; s.isAuthenticated = false;
    });
    // Load user
    builder.addCase(loadUser.fulfilled, (s, a) => {
      s.user = a.payload; s.isAuthenticated = !!a.payload;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;