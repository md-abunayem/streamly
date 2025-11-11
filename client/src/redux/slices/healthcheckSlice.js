import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import { extractErrorMessage } from "../../../utils/errorHandler";

const initialState = {
  data: null,
  isLoading: false,
  errorMessage: null,
  successMessage: null,
};

//Get healthcheck
export const getHealthCheck = createAsyncThunk(
  "system/healthcheck",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/healthcheck");

      return response?.data;klj
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to fetch healthcheck data")
      );
    }
  }
);

//Slice
const healthCheckSlice = createSlice({
  name: "healthcheck",
  initialState,
  reducers: {
    clearHealthcheckState: (state) => {
      state.data = null;
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
    builder
      .addCase(getHealthCheck.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(getHealthCheck.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.errorMessage = null;
        state.successMessage = "Service is healthy and running";
      })
      .addCase(getHealthCheck.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });
  },
});

export const {
  clearHealthcheckState,
  setSuccess,
  clearSuccess,
  setError,
  clearError,
} = healthCheckSlice.actions;
export default healthCheckSlice.reducer;
