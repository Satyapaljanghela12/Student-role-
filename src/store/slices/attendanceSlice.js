import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async ({ classId, date }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/attendance/class/${classId}/date/${date}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const markAttendance = createAsyncThunk(
  'attendance/markAttendance',
  async ({ classId, date, records }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/attendance/class/${classId}/date/${date}`, { records });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchAttendanceHistory = createAsyncThunk(
  'attendance/fetchAttendanceHistory',
  async ({ classId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await axios.get(`/attendance/class/${classId}/history?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchStudentAttendanceStats = createAsyncThunk(
  'attendance/fetchStudentAttendanceStats',
  async ({ studentId, classId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/attendance/student/${studentId}/class/${classId}/stats`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const exportAttendance = createAsyncThunk(
  'attendance/exportAttendance',
  async ({ classId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await axios.get(`/attendance/class/${classId}/export?${params}`, {
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance-${classId}-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return 'Export successful';
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    currentAttendance: null,
    attendanceHistory: [],
    studentStats: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAttendance: (state) => {
      state.currentAttendance = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch attendance
      .addCase(fetchAttendance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAttendance = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Mark attendance
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.currentAttendance.attendance = action.payload;
      })
      // Fetch attendance history
      .addCase(fetchAttendanceHistory.fulfilled, (state, action) => {
        state.attendanceHistory = action.payload;
      })
      // Fetch student attendance stats
      .addCase(fetchStudentAttendanceStats.fulfilled, (state, action) => {
        state.studentStats = action.payload;
      });
  },
});

export const { clearError, clearCurrentAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;