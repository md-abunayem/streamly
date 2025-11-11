import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import VideoDetailPage from "../pages/Video/VideoDetailPage";
import NotFoundPage from "../pages/NotFoundPage";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import YourChannel from "../pages/Channel/YourChannel";
import ChannelVideos from "../pages/Channel/ChannelVideos";
import ChannelPlaylists from "../pages/Channel/ChannelPlaylists";
import ChannelFollowing from "../pages/Channel/ChannelFollowing";
import ChannelTweets from "../pages/Channel/ChannelTweets";
import UploadVideoPage from "../pages/Upload/UploadVideoPage";
import PlaylistVideosPage from "../pages/Playlist/PlaylistVideosPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Main Layout */}
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/video/:videoId" element={<VideoDetailPage />} />
          <Route path="/search" element={<HomePage />} />
          <Route path="/playlist/:playlistId" element={<PlaylistVideosPage />} />

          {/* Protected Channel Routes */}
          <Route
            path="/your-channel"
            element={
              <ProtectedRoute>
                <YourChannel />
              </ProtectedRoute>
            }
          >
            {/* Nested routes for your channel tabs */}
            <Route index element={<ChannelVideos />} /> {/* Default tab */}
            <Route path="videos" element={<ChannelVideos />} />
            <Route path="playlists" element={<ChannelPlaylists />} />
            <Route path="tweets" element={<ChannelTweets />} />
            <Route path="following" element={<ChannelFollowing />} />
            <Route path="upload-video" element={<UploadVideoPage />} />
          </Route>

          <Route
            path="/upload-video"
            element={
              <ProtectedRoute>
                <UploadVideoPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
