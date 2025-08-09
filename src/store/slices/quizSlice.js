import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchQuizzes',
  async (classId, { rejectWithValue }) => {
    try {
      const url = classId ? `/quizzes/class/${classId}` : '/quizzes';
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchQuiz = createAsyncThunk(
  'quizzes/fetchQuiz',
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/quizzes/${quizId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createQuiz = createAsyncThunk(
  'quizzes/createQuiz',
  async (quizData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/quizzes', quizData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateQuiz = createAsyncThunk(
  'quizzes/updateQuiz',
  async ({ quizId, quizData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/quizzes/${quizId}`, quizData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  'quizzes/deleteQuiz',
  async (quizId, { rejectWithValue }) => {
    try {
      await axios.delete(`/quizzes/${quizId}`);
      return quizId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const gradeQuizAttempt = createAsyncThunk(
  'quizzes/gradeQuizAttempt',
  async ({ quizId, attemptId, gradeData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/quizzes/${quizId}/attempts/${attemptId}/grade`,
        gradeData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchQuizResults = createAsyncThunk(
  'quizzes/fetchQuizResults',
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/quizzes/${quizId}/results`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const quizSlice = createSlice({
  name: 'quizzes',
  initialState: {
    quizzes: [],
    currentQuiz: null,
    quizResults: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
    },
    clearQuizResults: (state) => {
      state.quizResults = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch quizzes
      .addCase(fetchQuizzes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single quiz
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.currentQuiz = action.payload;
      })
      // Create quiz
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.quizzes.unshift(action.payload);
      })
      // Update quiz
      .addCase(updateQuiz.fulfilled, (state, action) => {
        const index = state.quizzes.findIndex(quiz => quiz._id === action.payload._id);
        if (index !== -1) {
          state.quizzes[index] = action.payload;
        }
        if (state.currentQuiz && state.currentQuiz._id === action.payload._id) {
          state.currentQuiz = action.payload;
        }
      })
      // Delete quiz
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter(quiz => quiz._id !== action.payload);
      })
      // Grade quiz attempt
      .addCase(gradeQuizAttempt.fulfilled, (state, action) => {
        if (state.currentQuiz && state.currentQuiz._id === action.payload._id) {
          state.currentQuiz = action.payload;
        }
      })
      // Fetch quiz results
      .addCase(fetchQuizResults.fulfilled, (state, action) => {
        state.quizResults = action.payload;
      });
  },
});

export const { clearError, clearCurrentQuiz, clearQuizResults } = quizSlice.actions;
export default quizSlice.reducer;