import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import { extractErrorMessage } from "../../../utils/errorHandler";

const initialState = {
  playlist: null,
  playlists: [],
  selectedPlaylistId: null,
  isLoading: false,
  errorMessage: null,
  successMessage: null,
};

//Create Playlist
export const createPlaylist = createAsyncThunk(
  "playlist/createPlaylist",
  async (playlistDetails, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/playlists", playlistDetails);

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to create playlist")
      );
    }
  }
);

//Get Playlist By Id
export const getPlaylistById = createAsyncThunk(
  "playlist/getPlaylistById",
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/playlists/${playlistId}`);

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to fetch playlist")
      );
    }
  }
);

//Update Playlist
export const updatePlaylist = createAsyncThunk(
  "playlist/update",
  async ({ playlistId, updatedDetails }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(
        `/playlists/${playlistId}`,
        updatedDetails
      );

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to update playlist")
      );
    }
  }
);

//Delete Playlist
export const deletePlaylist = createAsyncThunk(
  "playlist/deletePlaylist",
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/playlists/${playlistId}`);

      return null;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to delete playlist")
      );
    }
  }
);

//Get User Playlists
export const getUserPlaylists = createAsyncThunk(
  "playlist/userPlaylists",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/playlists/user/${userId}`);

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to fetch playlists")
      );
    }
  }
);

//Add a video to a playlist
export const addVideoToPlaylist = createAsyncThunk(
  "playlist/addVideoToPlaylist",
  async ({ videoId, playlistId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/playlists/add/${videoId}/${playlistId}`
      );

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to add video to the playlist")
      );
    }
  }
);

//Remove a video from a playlist
export const removeVideoFromPlaylist = createAsyncThunk(
  "playlist/removeAVideo",
  async ({ videoId, playlistId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/playlists/remove/${videoId}/${playlistId}`
      );
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to remove video from playlist")
      );
    }
  }
);

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    clearPlaylistState: (state) => {
      state.playlist = null;
      state.playlists = [];
      state.isLoading = false;
      state.errorMessage = null;
      state.successMessage = null;
    },
    setSelectedPlaylistId: (state, action) => {
      state.selectedPlaylistId = action.payload;
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
    //Create Playlist
    builder
      .addCase(createPlaylist.pending, (state) => {
        state.isLoading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.playlist = action.payload;
        state.successMessage = "Playlist created successfully";
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });

    //Get Playlist By Id
    builder
      .addCase(getPlaylistById.pending, (state) => {
        state.isLoading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(getPlaylistById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.playlist = action.payload;
        state.successMessage = "Playlist fetched successfully";
      })
      .addCase(getPlaylistById.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });

    //Update playlist
    builder
      .addCase(updatePlaylist.pending, (state) => {
        state.isLoading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(updatePlaylist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.playlist = action.payload;
        state.successMessage = "Playlist updated successfully";
      })
      .addCase(updatePlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });

    //Delete playlist
    builder
      .addCase(deletePlaylist.pending, (state) => {
        state.isLoading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.successMessage = "Playlist deleted successfully";
      })
      .addCase(deletePlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });

    //Fetch user playlists
    builder
      .addCase(getUserPlaylists.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(getUserPlaylists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.playlists = action.payload;
        state.errorMessage = null;
        state.successMessage = "Successfully fetched playlists";
      })
      .addCase(getUserPlaylists.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });

    //Add video to a playlist
    builder
      .addCase(addVideoToPlaylist.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(addVideoToPlaylist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.playlist = action.payload;
        state.errorMessage = null;
        state.successMessage = "Successfully added video to the playlists";
      })
      .addCase(addVideoToPlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });

    //Remove video video to a playlist
    builder
      .addCase(removeVideoFromPlaylist.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.playlist = action.payload;
        state.errorMessage = null;
        state.successMessage = "Successfully removed video from the playlist";
      })
      .addCase(removeVideoFromPlaylist.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });
  },
});

export const {
  setSelectedPlaylistId,
  clearPlaylistState,
  setSuccess,
  clearSuccess,
  setError,
  clearError,
} = playlistSlice.actions;
export default playlistSlice.reducer;
