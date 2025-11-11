import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import { extractErrorMessage } from "../../../utils/errorHandler";

const initialState = {
  channel: null,
  watchHistory: [],
  isLoading: false,
  errorMessage: null,
  successMessage: null,
};

//Fetch user channel
export const fetchUserChannel = createAsyncThunk(
  "user/fetchChannel",
  async (userName, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/users/channel/${userName}`);

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to fetch channel data.")
      );
    }
  }
);

//Fetch current user's watch history
export const fetchWatchHistory = createAsyncThunk(
  "user/fetchWatchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/users/watch-history");

      return response?.data?.data || [];
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to fetch watch history.")
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.channel = null;
      state.watchHistory = [];
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
    //Fetch User Channel
    builder
      .addCase(fetchUserChannel.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchUserChannel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.channel = action.payload;
        state.successMessage = "User channel fetched successfully";
        state.errorMessage = null;
      })
      .addCase(fetchUserChannel.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload || "Failed to fetch user channel";
        state.successMessage = null;
      });
  },
});

export const {
  clearUserState,
  clearError,
  setError,
  clearSuccess,
  setSuccess,
} = userSlice.actions;
export default userSlice.reducer;
