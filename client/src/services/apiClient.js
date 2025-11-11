import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const apiClient = axios.create({
    baseURL: `${API_BASE_URL}`,
    timeout: 30000,
    withCredentials: true
});

// Request interceptor: attach access token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Refresh token function
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/refresh-token`,
      {},
      { withCredentials: true }
    );

    const { accessToken, refreshToken } = response.data.data;

    // Save tokens to localStorage
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    return accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    // Clear invalid tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Redirect to login
    window.location.href = "/login";
    throw error;
  }
};

// Response interceptor: handle 401 errors and retry with refreshed token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        
        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;