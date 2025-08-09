import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchAnnouncements = createAsyncThunk(
  'communication/fetchAnnouncements',
  async (classId, { rejectWithValue }) => {
    try {
      const url = classId ? `/communication/announcements/class/${classId}` : '/communication/announcements';
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createAnnouncement = createAsyncThunk(
  'communication/createAnnouncement',
  async (announcementData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/communication/announcements', announcementData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateAnnouncement = createAsyncThunk(
  'communication/updateAnnouncement',
  async ({ announcementId, announcementData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/communication/announcements/${announcementId}`, announcementData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteAnnouncement = createAsyncThunk(
  'communication/deleteAnnouncement',
  async (announcementId, { rejectWithValue }) => {
    try {
      await axios.delete(`/communication/announcements/${announcementId}`);
      return announcementId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'communication/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/communication/messages');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'communication/sendMessage',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/communication/messages', formData, {
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

export const markMessageAsRead = createAsyncThunk(
  'communication/markMessageAsRead',
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/communication/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchConversation = createAsyncThunk(
  'communication/fetchConversation',
  async (recipientId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/communication/messages/conversation/${recipientId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const communicationSlice = createSlice({
  name: 'communication',
  initialState: {
    announcements: [],
    messages: [],
    currentConversation: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch announcements
      .addCase(fetchAnnouncements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.announcements = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create announcement
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.announcements.unshift(action.payload);
      })
      // Update announcement
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        const index = state.announcements.findIndex(announcement => announcement._id === action.payload._id);
        if (index !== -1) {
          state.announcements[index] = action.payload;
        }
      })
      // Delete announcement
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.announcements = state.announcements.filter(announcement => announcement._id !== action.payload);
      })
      // Fetch messages
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.unshift(action.payload);
        state.currentConversation.push(action.payload);
      })
      // Mark message as read
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        const index = state.messages.findIndex(message => message._id === action.payload._id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      })
      // Fetch conversation
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.currentConversation = action.payload;
      });
  },
});

export const { clearError, clearCurrentConversation } = communicationSlice.actions;
export default communicationSlice.reducer;