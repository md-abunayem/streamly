// src/pages/UploadVideoPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UploadCloud, Video, Image, Loader2 } from "lucide-react";
import {
  publishVideo,
  togglePublishVideo,
} from "../../redux/slices/videoSlice";
import { toast } from "react-toastify";

const UploadVideoPage = () => {
  const dispatch = useDispatch();
  const { selectedVideo, isLoading, successMessage, errorMessage } =
    useSelector((state) => state.video);

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setVideoFile(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e) => setVideoFile(e.target.files[0]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!videoFile) return alert("Please select or drag a video first!");

    const formData = { videoFile, thumbnail, title, description };
    dispatch(publishVideo(formData));
  };

  useEffect(() => {
    if (selectedVideo) {
      dispatch(togglePublishVideo(selectedVideo._id));
    }
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [successMessage, dispatch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <div className="w-full max-w-xl bg-gray-800 shadow-lg rounded-2xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Upload Your Video
        </h2>

        {/* Drag & Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all duration-300 ${
            isDragging
              ? "border-blue-500 bg-gray-700"
              : "border-gray-600 bg-gray-800 hover:border-blue-400"
          }`}
        >
          {!videoFile ? (
            <>
              <UploadCloud size={48} className="text-gray-400 mb-3" />
              <p className="text-gray-300 mb-2">Drag & drop your video here</p>
              <label className="cursor-pointer text-blue-400 font-medium hover:underline">
                or browse to select a file
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </>
          ) : (
            <div className="text-center">
              <Video size={40} className="text-green-500 mx-auto mb-2" />
              <p className="text-gray-200 font-semibold">{videoFile.name}</p>
              <p className="text-sm text-gray-400">
                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>

        {/* Video Details */}
        <div className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Video Title"
            className="w-full border border-gray-600 rounded-lg p-3 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="w-full border border-gray-600 rounded-lg p-3 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition bg-gray-900 text-white">
            <Image size={24} className="text-gray-400 mb-1" />
            <span className="text-gray-300 text-sm">
              {thumbnail ? thumbnail.name : "Upload Thumbnail"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setThumbnail(e.target.files[0])}
            />
          </label>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${
            isLoading
              ? "bg-blue-600 cursor-not-allowed text-gray-200"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud size={20} />
              Upload Video
            </>
          )}
        </button>

        {errorMessage && (
          <p className="text-red-500 mt-4 text-center font-medium">
            ❌ {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadVideoPage;
