import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import { extractErrorMessage } from "../../../utils/errorHandler";

const initialState = {
  tweet: null,
  tweets: [],
  isLoading: false,
  errorMessage: null,
  successMessage: null,
};

//Create Tweet(post by user)
export const createTweet = createAsyncThunk(
  "tweet/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/tweets", data);

      return response?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to create tweet.")
      );
    }
  }
);

//Get A User Tweets
export const getUserTweets = createAsyncThunk(
  "tweet/getUserTweets",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/tweets/user/${userId}`);

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to fetch user tweets")
      );
    }
  }
);

//Update user tweet
export const updateTweet = createAsyncThunk(
  "tweet/update",
  async ({ tweetId, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/tweets/${tweetId}`, data);

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to update tweet")
      );
    }
  }
);

//Delete tweet
export const deleteTweet = createAsyncThunk(
  "tweet/delete",
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/tweets/${tweetId}`);

      return response?.data?.message;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to delete message, try again")
      );
    }
  }
);

const tweetSlice = createSlice({
  name: "tweet",
  initialState,
  reducers: {
    clearTweetState: (state) => {
      state.tweet = null;
      state.tweets = [];
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
    //Create user tweet
    builder
      .addCase(createTweet.pending, (state) => {
        state.isLoading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(createTweet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tweet = action.payload.data;
        state.errorMessage = null;
        state.successMessage = "Tweet posted successfully";
      })
      .addCase(createTweet.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });

    //Get user tweets
    builder
      .addCase(getUserTweets.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(getUserTweets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tweets = action.payload;
        state.errorMessage = null;
        state.successMessage = "User tweets fetched successfully";
      })

      .addCase(getUserTweets.rejected, (state, action) => {
        state.isLoading = false;
        state.successMessage = null;
        state.errorMessage = action.payload;
      });

    //Update tweet
    builder
      .addCase(updateTweet.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(updateTweet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tweet = action.payload;
        state.errorMessage = null;
        state.successMessage = "Tweet updated successfully";
      })
      .addCase(updateTweet.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });

    //Delete Tweet
    builder
      .addCase(deleteTweet.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(deleteTweet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.successMessage = action.payload;
      })
      .addCase(deleteTweet.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });
  },
});

export const {
  clearTweetState,
  setSuccess,
  clearSuccess,
  setError,
  clearError,
} = tweetSlice.actions;
export default tweetSlice.reducer;
