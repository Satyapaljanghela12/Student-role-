import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/classes');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchClass = createAsyncThunk(
  'classes/fetchClass',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/classes/${classId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createClass = createAsyncThunk(
  'classes/createClass',
  async (classData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/classes', classData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateClass = createAsyncThunk(
  'classes/updateClass',
  async ({ classId, classData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/classes/${classId}`, classData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteClass = createAsyncThunk(
  'classes/deleteClass',
  async (classId, { rejectWithValue }) => {
    try {
      await axios.delete(`/classes/${classId}`);
      return classId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchAvailableStudents = createAsyncThunk(
  'classes/fetchAvailableStudents',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/classes/${classId}/available-students`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const addStudentsToClass = createAsyncThunk(
  'classes/addStudentsToClass',
  async ({ classId, studentIds }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/classes/${classId}/students`, { studentIds });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const removeStudentFromClass = createAsyncThunk(
  'classes/removeStudentFromClass',
  async ({ classId, studentId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/classes/${classId}/students/${studentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const classSlice = createSlice({
  name: 'classes',
  initialState: {
    classes: [],
    currentClass: null,
    availableStudents: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentClass: (state) => {
      state.currentClass = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch classes
      .addCase(fetchClasses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single class
      .addCase(fetchClass.fulfilled, (state, action) => {
        state.currentClass = action.payload;
      })
      // Create class
      .addCase(createClass.fulfilled, (state, action) => {
        state.classes.unshift(action.payload);
      })
      // Update class
      .addCase(updateClass.fulfilled, (state, action) => {
        const index = state.classes.findIndex(cls => cls._id === action.payload._id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
        if (state.currentClass && state.currentClass._id === action.payload._id) {
          state.currentClass = action.payload;
        }
      })
      // Delete class
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.classes = state.classes.filter(cls => cls._id !== action.payload);
      })
      // Fetch available students
      .addCase(fetchAvailableStudents.fulfilled, (state, action) => {
        state.availableStudents = action.payload;
      })
      // Add students to class
      .addCase(addStudentsToClass.fulfilled, (state, action) => {
        const index = state.classes.findIndex(cls => cls._id === action.payload._id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
        if (state.currentClass && state.currentClass._id === action.payload._id) {
          state.currentClass = action.payload;
        }
      })
      // Remove student from class
      .addCase(removeStudentFromClass.fulfilled, (state, action) => {
        const index = state.classes.findIndex(cls => cls._id === action.payload._id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
        if (state.currentClass && state.currentClass._id === action.payload._id) {
          state.currentClass = action.payload;
        }
      });
  },
});

export const { clearError, clearCurrentClass } = classSlice.actions;
export default classSlice.reducer;