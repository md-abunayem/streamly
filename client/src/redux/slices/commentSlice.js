import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import { extractErrorMessage } from "../../../utils/errorHandler";

const initialState = {
  comment: null,
  allComments: [],
  isLoading: false,
  errorMessage: null,
  successMessage: null,
};

//create(add) video comment
export const createVideoComment = createAsyncThunk(
  "comment/createVideoComment",
  async ({ videoId, content }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/comments/${videoId}`,
        {content}
      );

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to commant on the video")
      );
    }
  }
);

//Update video comment
export const updateComment = createAsyncThunk(
  "comment/updateComment",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(
        `/comments/channel/${commentId}`,
        {content}
      );

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to update comment")
      );
    }
  }
);

//Get all comment of a video
export const getAllComments = createAsyncThunk(
  "comment/getAllComments",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/comments/${videoId}`);

      return response?.data?.data?.comments;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to fetched all comments")
      );
    }
  }
);

//Delete video comment
export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/comments/channel/${commentId}`);

      return null;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to delete comment")
      );
    }
  }
);

//Slice
const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    clearCommentState: (state) => {
      state.comment = null;
      state.allComments = [];
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
    //create (add) comment
    builder
      .addCase(createVideoComment.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(createVideoComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comment = action.payload;
        state.errorMessage = null;
        state.successMessage = "Successfully commented to the video";
      })
      .addCase(createVideoComment.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });

    //update comment
    builder
      .addCase(updateComment.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comment = action.payload;
        state.errorMessage = null;
        state.successMessage = "Successfully updated comment";
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });

    //Get all the comments
    builder
      .addCase(getAllComments.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allComments = action.payload;
        state.errorMessage = null;
        state.successMessage = "Successfully fetched all the comments";
      })
      .addCase(getAllComments.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });

    //Delete comment
    builder
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.successMessage = "Successfully deleted comment";
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });
  },
});

export const {
  clearCommentState,
  setSuccess,
  clearSuccess,
  setError,
  clearError,
} = commentSlice.actions;
export default commentSlice.reducer;
