import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchResources = createAsyncThunk(
  'resources/fetchResources',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const response = await axios.get(`/resources?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchResource = createAsyncThunk(
  'resources/fetchResource',
  async (resourceId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/resources/${resourceId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const uploadResource = createAsyncThunk(
  'resources/uploadResource',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/resources', formData, {
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

export const updateResource = createAsyncThunk(
  'resources/updateResource',
  async ({ resourceId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/resources/${resourceId}`, formData, {
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

export const deleteResource = createAsyncThunk(
  'resources/deleteResource',
  async (resourceId, { rejectWithValue }) => {
    try {
      await axios.delete(`/resources/${resourceId}`);
      return resourceId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchResourceCategories = createAsyncThunk(
  'resources/fetchResourceCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/resources/categories/list');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const downloadResource = createAsyncThunk(
  'resources/downloadResource',
  async (resourceId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/resources/${resourceId}/download`, {
        responseType: 'blob',
      });
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'download';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return 'Download successful';
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const resourceSlice = createSlice({
  name: 'resources',
  initialState: {
    resources: [],
    currentResource: null,
    categories: { subjects: [], topics: [] },
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentResource: (state) => {
      state.currentResource = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch resources
      .addCase(fetchResources.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resources = action.payload;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single resource
      .addCase(fetchResource.fulfilled, (state, action) => {
        state.currentResource = action.payload;
      })
      // Upload resource
      .addCase(uploadResource.fulfilled, (state, action) => {
        state.resources.unshift(action.payload);
      })
      // Update resource
      .addCase(updateResource.fulfilled, (state, action) => {
        const index = state.resources.findIndex(resource => resource._id === action.payload._id);
        if (index !== -1) {
          state.resources[index] = action.payload;
        }
        if (state.currentResource && state.currentResource._id === action.payload._id) {
          state.currentResource = action.payload;
        }
      })
      // Delete resource
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.resources = state.resources.filter(resource => resource._id !== action.payload);
      })
      // Fetch resource categories
      .addCase(fetchResourceCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { clearError, clearCurrentResource } = resourceSlice.actions;
export default resourceSlice.reducer;