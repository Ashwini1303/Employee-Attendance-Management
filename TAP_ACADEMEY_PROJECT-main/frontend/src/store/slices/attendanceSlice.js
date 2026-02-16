import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const initialState = {
  todayStatus: null,
  myHistory: [],
  mySummary: null,
  allAttendance: [],
  todayStatusAll: null,
  summary: null,
  dashboardData: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get auth header
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };
};

// Check in
export const checkIn = createAsyncThunk('attendance/checkin', async (_, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/attendance/checkin`, {}, getAuthHeader());
    return response.data.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Check out
export const checkOut = createAsyncThunk('attendance/checkout', async (_, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/attendance/checkout`, {}, getAuthHeader());
    return response.data.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get today's status
export const getTodayStatus = createAsyncThunk('attendance/today', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/attendance/today`, getAuthHeader());
    return response.data.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get my history
export const getMyHistory = createAsyncThunk('attendance/myHistory', async (params, thunkAPI) => {
  try {
    const queryString = params ? `?month=${params.month}&year=${params.year}` : '';
    const response = await axios.get(`${API_URL}/attendance/my-history${queryString}`, getAuthHeader());
    return response.data.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get my summary
export const getMySummary = createAsyncThunk('attendance/mySummary', async (params, thunkAPI) => {
  try {
    const queryString = params ? `?month=${params.month}&year=${params.year}` : '';
    const response = await axios.get(`${API_URL}/attendance/my-summary${queryString}`, getAuthHeader());
    return response.data.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get employee dashboard
export const getEmployeeDashboard = createAsyncThunk('attendance/employeeDashboard', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/employee`, getAuthHeader());
    return response.data.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get manager dashboard
export const getManagerDashboard = createAsyncThunk('attendance/managerDashboard', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/manager`, getAuthHeader());
    return response.data.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get all attendance (Manager)
export const getAllAttendance = createAsyncThunk('attendance/all', async (params, thunkAPI) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axios.get(`${API_URL}/attendance/all?${queryParams}`, getAuthHeader());
    return response.data.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get today status all (Manager)
export const getTodayStatusAll = createAsyncThunk('attendance/todayStatusAll', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/attendance/today-status`, getAuthHeader());
    return response.data.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todayStatus = action.payload;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(checkOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todayStatus = action.payload;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTodayStatus.fulfilled, (state, action) => {
        state.todayStatus = action.payload;
      })
      .addCase(getMyHistory.fulfilled, (state, action) => {
        state.myHistory = action.payload;
      })
      .addCase(getMySummary.fulfilled, (state, action) => {
        state.mySummary = action.payload;
      })
      .addCase(getEmployeeDashboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEmployeeDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload;
      })
      .addCase(getManagerDashboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getManagerDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload;
      })
      .addCase(getAllAttendance.fulfilled, (state, action) => {
        state.allAttendance = action.payload;
      })
      .addCase(getTodayStatusAll.fulfilled, (state, action) => {
        state.todayStatusAll = action.payload;
      });
  },
});

export const { reset } = attendanceSlice.actions;
export default attendanceSlice.reducer;
