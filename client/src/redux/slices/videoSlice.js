import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import { extractErrorMessage } from "../../../utils/errorHandler";

const initialState = {
  videos: [],
  selectedVideo: null,
  isLoading: false,
  errorMessage: null,
  successMessage: null,
};

//api calls can be added here using createAsyncThunk
//Get all videos
export const fetchAllVideos = createAsyncThunk(
  "videos/fetchAllVideos",
  async (
    {
      query = "", // search keyword
      page = 1, // pagination
      limit = 10, // number of videos per page
      sortBy = "createdAt",
      sortType = "desc",
      userId = "", // optional: filter by channel/user
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const params = new URLSearchParams();

      if (query) params.append("query", query);
      if (userId) params.append("userId", userId);

      params.append("page", page);
      params.append("limit", limit);
      params.append("sortBy", sortBy);
      params.append("sortType", sortType);

      const response = await apiClient.get(`/videos?${params.toString()}`);

      // Your backend response format: ApiResponse { status, data, message }
      return response?.data?.data?.docs;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to fetch videos."),
      );
    }
  },
);

//Fetch all videos of a specific user(channel)
export const fetchUserVideos = createAsyncThunk(
  "videos/fetchUserVideos",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/videos?userId=${userId}`);
      return response?.data?.data?.docs;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to fetch user videos."),
      );
    }
  },
);

//Get Video by Id
export const getVideoById = createAsyncThunk(
  "videos/getVideoById",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/videos/${videoId}`);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to fetch video by Id."),
      );
    }
  },
);

//Publish A Video
export const publishVideo = createAsyncThunk(
  "videos/publishVideo",
  async (videoData, { rejectWithValue }) => {
    try {
      const data = new FormData();
      //create object for multer
      Object.keys(videoData).forEach((key) => {
        if (videoData[key]) {
          data.append(key, videoData[key]);
        }
      });

      const response = await apiClient.post("/videos/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to publish video."),
      );
    }
  },
);

//Update A Video
export const updateVideo = createAsyncThunk(
  "video/updateVideo",
  async ({ videoId, updatedData }, { rejectWithValue }) => {
    try {
      const data = new FormData();
      //create object for multer
      Object.keys(updatedData).forEach((key) => {
        if (updatedData[key]) {
          data.append(key, updatedData[key]);
        }
      });

      const response = await apiClient.patch(`/videos/${videoId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to update video."),
      );
    }
  },
);

//Delete Video
export const deleteVideo = createAsyncThunk(
  "videos/deleteVideo",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/videos/${videoId}`);

      return response?.data?.message;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to delete video."),
      );
    }
  },
);

//Toggle Publish/Unpublish Video
export const togglePublishVideo = createAsyncThunk(
  "videos/togglePublishVideo",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(
        `/videos/toggle/publish/${videoId}`,
      );
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to toggle publish status."),
      );
    }
  },
);

//Slice
const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    clearVideoState: (state) => {
      state.videos = [];
      state.selectedVideo = null;
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
    //Fetch All Videos
    builder
      .addCase(fetchAllVideos.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(fetchAllVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.videos = Array.isArray(action.payload) ? action.payload : [];
        state.successMessage = "Videos fetched successfully";
        state.errorMessage = null;
      })
      .addCase(fetchAllVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload || "Failed to fetch videos";
        state.successMessage = null;
      });

    // Fetch all videos of a specific user (channel)
    builder
      .addCase(fetchUserVideos.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(fetchUserVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.videos = action.payload; // reusing videos array for now
        state.successMessage = "User videos fetched successfully";
        state.errorMessage = null;
      })
      .addCase(fetchUserVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload || "Failed to fetch user videos";
        state.successMessage = null;
      });

    //Get(single video) Video By Id
    builder
      .addCase(getVideoById.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(getVideoById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedVideo = action.payload;
        state.successMessage = "Video fetched successfully";
        state.errorMessage = null;
      })
      .addCase(getVideoById.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload || "Failed to fetch video";
        state.successMessage = null;
      });

    //Publish A Video
    builder
      .addCase(publishVideo.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(publishVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedVideo = action.payload;
        state.successMessage = "Video published successfully";
        state.errorMessage = null;
      })
      .addCase(publishVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload || "Failed to publish video";
        state.successMessage = null;
      });

    //Update A Video
    builder
      .addCase(updateVideo.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedVideo = action.payload;
        state.errorMessage = null;
        state.successMessage = "Video updated successfully";
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });

    //Delete Video
    builder
      .addCase(deleteVideo.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload;
        state.errorMessage = null;
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });

    //Toggle Publish/Unpublish Video
    builder
      .addCase(togglePublishVideo.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(togglePublishVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedVideo = action.payload;
        state.successMessage = "Video publish status toggled successfully";
        state.errorMessage = null;
      })
      .addCase(togglePublishVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });
  },
});

export const {
  clearVideoState,
  setSuccess,
  clearSuccess,
  setError,
  clearError,
} = videoSlice.actions;

export default videoSlice.reducer;
