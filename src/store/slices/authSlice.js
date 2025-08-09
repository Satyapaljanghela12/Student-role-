import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Set auth token
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Initialize token from localStorage
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

// Async thunks
export const loginTeacher = createAsyncThunk(
  'auth/loginTeacher',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      setAuthToken(response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const registerTeacher = createAsyncThunk(
  'auth/registerTeacher',
  async (teacherData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/register', teacherData);
      setAuthToken(response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getCurrentTeacher = createAsyncThunk(
  'auth/getCurrentTeacher',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/auth/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/teacher/profile', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const uploadProfilePhoto = createAsyncThunk(
  'auth/uploadProfilePhoto',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/teacher/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/teacher/password', passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    teacher: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token'),
  },
  reducers: {
    logout: (state) => {
      state.teacher = null;
      state.token = null;
      state.isAuthenticated = false;
      setAuthToken(null);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginTeacher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginTeacher.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teacher = action.payload.teacher;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginTeacher.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerTeacher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerTeacher.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teacher = action.payload.teacher;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerTeacher.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get current teacher
      .addCase(getCurrentTeacher.fulfilled, (state, action) => {
        state.teacher = action.payload;
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.teacher = action.payload;
      })
      // Upload profile photo
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        if (state.teacher) {
          state.teacher.profilePhoto = action.payload.profilePhoto;
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;