import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/api';

export const fetchCycles = createAsyncThunk('cycle/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get(ENDPOINTS.CYCLES);
    return res.data.results || res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const addCycle = createAsyncThunk('cycle/add', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post(ENDPOINTS.CYCLES, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const fetchStats = createAsyncThunk('cycle/stats', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get(ENDPOINTS.CYCLE_STATS);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

const cycleSlice = createSlice({
  name: 'cycle',
  initialState: {
    cycles: [],
    stats: null,
    prediction: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCycles.pending, (s) => { s.loading = true; });
    builder.addCase(fetchCycles.fulfilled, (s, a) => { s.loading = false; s.cycles = a.payload; });
    builder.addCase(fetchCycles.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    builder.addCase(addCycle.fulfilled, (s, a) => { s.cycles.unshift(a.payload); });
    builder.addCase(fetchStats.fulfilled, (s, a) => { s.stats = a.payload; });
  },
});

export default cycleSlice.reducer;