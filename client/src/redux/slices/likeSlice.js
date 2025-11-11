import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import { extractErrorMessage } from "../../../utils/errorHandler";

const initialState = {
  like: null, //video or comment or tweet
  likedVideos: [],
  isLoading: false,
  errorMessage: null,
  successMessage: null,
};

export const toggleVideoLike = createAsyncThunk(
  "like/toggleVideoLike",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/likes/toggle/video/${videoId}`);

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to like the video")
      );
    }
  }
);

export const toggleTweetLike = createAsyncThunk(
  "like/toggleTweetLike",
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/likes/toggle/tweet/${tweetId}`);

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to like the tweet")
      );
    }
  }
);

//Toggle comment like
export const toggleCommentLike = createAsyncThunk(
  "like/toggleCommentLike",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/likes/toggle/channel/${commentId}`
      );

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to like the comment")
      );
    }
  }
);

//Get liked video
export const getLikedVideos = createAsyncThunk(
  "like/getLikedVideos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/likes/videos");

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to fetched all the videos")
      );
    }
  }
);

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    clearLikeState: (state) => {
      state.like = null;
      state.likedVideos = [];
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
    //Toggle video like
    builder
      .addCase(toggleVideoLike.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(toggleVideoLike.fulfilled, (state, action) => {
        state.isLoading = false;
        state.like = action.payload;
        state.successMessage = "Liked the video";
        state.errorMessage = null;
      })
      .addCase(toggleVideoLike.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });

    //Toggle tweet like
    builder
      .addCase(toggleTweetLike.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(toggleTweetLike.fulfilled, (state, action) => {
        state.isLoading = false;
        state.like = action.payload;
        state.successMessage = "Liked the tweet";
        state.errorMessage = null;
      })
      .addCase(toggleTweetLike.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });

    //Toggle comment like
    builder
      .addCase(toggleCommentLike.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        state.isLoading = false;
        state.like = action.payload;
        state.successMessage = "Liked the comment";
        state.errorMessage = null;
      })
      .addCase(toggleCommentLike.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });

    //Get all the liked videos
    builder
      .addCase(getLikedVideos.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(getLikedVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.likedVideos = action.payload;
        state.successMessage = "Successfully fetched all the liked videos";
        state.errorMessage = null;
      })
      .addCase(getLikedVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });
  },
});

export const {
  clearLikeState,
  setSuccess,
  clearSuccess,
  setError,
  clearError,
} = likeSlice.actions;

export default likeSlice.reducer;
