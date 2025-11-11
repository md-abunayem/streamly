import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import { extractErrorMessage } from "../../../utils/errorHandler";

const initialState = {
  subscribers: [],
  subscribedChannels: [],
  subscriptionStatus: {},
  isLoading: false,
  errorMessage: null,
  successMessage: null,
};

//Get user channel subscribers
export const getUserChannelSubscribers = createAsyncThunk(
  "subscription/getChannelSubscribers",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/subscriptions/channel/${channelId}/subscribers`
      );

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to fetch channel subscribers.")
      );
    }
  }
);

//Toggle Subscription
export const toggleSubscription = createAsyncThunk(
  "subscription/toggle",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/subscriptions/channel/${channelId}/toggle`,
        { channelId }
      );

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to toggle subscription.")
      );
    }
  }
);

//Subscribed channels of a user
const getSubscribedChannel = createAsyncThunk(
  "subscription/getSubscribedChannels",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/subscriptions/user/${userId}/channels`
      );

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to fetch subscribed channels.")
      );
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    clearSubscriptionState: (state) => {
      state.subscribers = [];
      state.subscribedChannels = [];
      state.subscriptionStatus = {};
      state.errorMessage = null;
      state.successMessage = null;
      state.isLoading = false;
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
    clearError: (state, action) => {
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserChannelSubscribers.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(getUserChannelSubscribers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscribers = action.payload;
        state.successMessage = "Subscribers fetched successfully";
        state.errorMessage = null;
      })
      .addCase(getUserChannelSubscribers.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload || "Failed to fetch subscribers";
        state.successMessage = null;
      });

    //Toggle Subscription
    builder
      .addCase(toggleSubscription.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptionStatus = action.payload;
        state.successMessage = "Subscription status updated successfully";
        state.errorMessage = null;
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage =
          action.payload || "Failed to update subscription status";
        state.successMessage = null;
      });

    //Subscribed channels of a user
    builder
      .addCase(getSubscribedChannel.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(getSubscribedChannel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscribedChannels = action.payload;
        state.successMessage = "Subscribed channels fetched successfully";
        state.errorMessage = null;
      })
      .addCase(getSubscribedChannel.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });
  },
});

export const {
  clearSubscriptionState,
  setSuccess,
  clearSuccess,
  setError,
  clearError,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
