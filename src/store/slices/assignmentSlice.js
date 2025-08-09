import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAssignments',
  async (classId, { rejectWithValue }) => {
    try {
      const url = classId ? `/assignments/class/${classId}` : '/assignments';
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchAssignment = createAsyncThunk(
  'assignments/fetchAssignment',
  async (assignmentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createAssignment = createAsyncThunk(
  'assignments/createAssignment',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/assignments', formData, {
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

export const updateAssignment = createAsyncThunk(
  'assignments/updateAssignment',
  async ({ assignmentId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/assignments/${assignmentId}`, formData, {
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

export const deleteAssignment = createAsyncThunk(
  'assignments/deleteAssignment',
  async (assignmentId, { rejectWithValue }) => {
    try {
      await axios.delete(`/assignments/${assignmentId}`);
      return assignmentId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const gradeSubmission = createAsyncThunk(
  'assignments/gradeSubmission',
  async ({ assignmentId, submissionId, gradeData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/assignments/${assignmentId}/submissions/${submissionId}/grade`,
        gradeData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState: {
    assignments: [],
    currentAssignment: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAssignment: (state) => {
      state.currentAssignment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch assignments
      .addCase(fetchAssignments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single assignment
      .addCase(fetchAssignment.fulfilled, (state, action) => {
        state.currentAssignment = action.payload;
      })
      // Create assignment
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.assignments.unshift(action.payload);
      })
      // Update assignment
      .addCase(updateAssignment.fulfilled, (state, action) => {
        const index = state.assignments.findIndex(assignment => assignment._id === action.payload._id);
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
        if (state.currentAssignment && state.currentAssignment._id === action.payload._id) {
          state.currentAssignment = action.payload;
        }
      })
      // Delete assignment
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.assignments = state.assignments.filter(assignment => assignment._id !== action.payload);
      })
      // Grade submission
      .addCase(gradeSubmission.fulfilled, (state, action) => {
        if (state.currentAssignment && state.currentAssignment._id === action.payload._id) {
          state.currentAssignment = action.payload;
        }
      });
  },
});

export const { clearError, clearCurrentAssignment } = assignmentSlice.actions;
export default assignmentSlice.reducer;