import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import { extractErrorMessage } from "../../../utils/errorHandler";

const initialState = {
  user: null,
  isLoading: false,
  errorMessage: null,
  isAuthenticated: false,
  successMessage: null,
};

//Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const data = new FormData();
      //create object for multer(files send)
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      const response = await apiClient.post("/users/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Registration failed. Please try again.")
      );
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/users/login", credentials);

      const { accessToken, refreshToken, user } = response?.data?.data || {};

      if (!accessToken || !refreshToken) {
        throw new Error("Invalid server response");
      }

      //store tokens in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return user;
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return rejectWithValue(
        extractErrorMessage(
          error,
          "Login failed. Please check your credentials."
        )
      );
    }
  }
);

//Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post("/users/logout");

      //clear tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      return null;
    } catch (error) {
      //even if the api call fails, clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      return rejectWithValue(
        extractErrorMessage(error, "Logout failed. Please try again.")
      );
    }
  }
);

//Get Current User
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/users/current-user");

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(
          error,
          "Failed to fetch user data. Please try again."
        )
      );
    }
  }
);

//Update Accout Details
export const updateAccountDetails = createAsyncThunk(
  "auth/updateAccountDetails",
  async (details, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch("/users/update-account", details);

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(
          error,
          "Failed to update account details. Please try again."
        )
      );
    }
  }
);

//Change User Password
export const changeUserPassword = createAsyncThunk(
  "auth/changeUserPassword",
  async (passwords, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(
        "/users/change-password",
        passwords
      );

      return response?.data?.message;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(
          error,
          "Failed to change password. Please try again."
        )
      );
    }
  }
);

//Update User Avatar
export const updateUserAvatar = createAsyncThunk(
  "auth/updateUserAvatar",
  async (avatarFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await apiClient.patch("/users/update-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to update avatar. Please try again.")
      );
    }
  }
);

//Update User Cover Image
export const updateUserCoverImage = createAsyncThunk(
  "auth/updateUserCoverImage",
  async (coverImageFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("coverImage", coverImageFile);

      const response = await apiClient.patch(
        "/users/update-cover-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(
          error,
          "Failed to update cover image. Please try again."
        )
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.errorMessage = action.payload;
    },
    clearError: (state, action) => {
      state.errorMessage = null;
    },
    setSuccess: (state, action) => {
      state.successMessage = action.payload;
    },
    clearSuccess: (state, action) => {
      state.successMessage = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.errorMessage = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    //Register User
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.errorMessage = null;
    });

    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.successMessage = "Registration successful!";
    });

    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    });

    //Login User
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.successMessage = "Login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.isAuthenticated = false;
      });

    //Logout User
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.successMessage = "Logout successful";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      });

    //Get Current User
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.isAuthenticated = false;
      });

    //Update Account Details
    builder
      .addCase(updateAccountDetails.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(updateAccountDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.successMessage = "Account details updated successfully";
      })
      .addCase(updateAccountDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      });

    //Change User Password
    builder
      .addCase(changeUserPassword.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.successMessage = null;
        state.errorMessage = action.payload;
      });

    //Change User Avatar
    builder
      .addCase(updateUserAvatar.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.user = action.payload;
        state.successMessage = "Avatar Changed Successfully";
      })
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });

    //Update User Cover Image
    builder
      .addCase(updateUserCoverImage.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(updateUserCoverImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.user = action.payload;
        state.successMessage = "Updated User Cover Image";
      })
      .addCase(updateUserCoverImage.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.successMessage = null;
      });
  },
});

export const {
  setUser,
  setLoading,
  setError,
  clearError,
  setSuccess,
  clearSuccess,
  clearAuth,
} = authSlice.actions;
export default authSlice.reducer;
