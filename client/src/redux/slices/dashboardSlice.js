import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import { extractErrorMessage } from "../../../utils/errorHandler";

const initialState = {
  dashboardStats: null,
  allVideos: [],
  isLoading: false,
  errorMessage: null,
  successMessage: null,
};

//Get dashboard stats
export const getDashboardStats = createAsyncThunk(
  "dashboard/dashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/dashboard/stats");

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to fetch stats data")
      );
    }
  }
);

//Get all the videos
export const getAllChannelVideos = createAsyncThunk(
  "dashboard/channelVideos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/dashboard/videos");

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to fetch videos data")
      );
    }
  }
);

//Slice
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardState: (state) => {
      state.dashboardStats = null;
      state.allVideos = [];
      state.isLoading = false;
      state.errorMessage = null;
      state.successMessage = null;
    },
    setSuccess: (state, action) => {
      state.successMessage = action.payload;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    setError: (state, action) => {
      state.errorMessage = action.payload;
    },
    clearError: (state) => {
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    //Get Dashboard Stats
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
        (state.errorMessage = null), (state.successMessage = null);
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardStats = action.payload;
        state.errorMessage = null;
        state.successMessage = "Channel stats fetched successfully";
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });

    //Get Channel Videos
    builder
      .addCase(getAllChannelVideos.pending, (state) => {
        state.isLoading = true;
        (state.errorMessage = null), (state.successMessage = null);
      })
      .addCase(getAllChannelVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allVideos = action.payload;
        state.errorMessage = null;
        state.successMessage = "Channel videos fetched successfully";
      })
      .addCase(getAllChannelVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });
  },
});

export const {
  clearDashboardState,
  setSuccess,
  clearSuccess,
  setError,
  clearError,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
