import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePlaylist,
  getPlaylistById,
} from "../../redux/slices/playlistSlice";
import { toast } from "react-toastify";
import { setIsEditPlaylistModalAppear } from "../../redux/slices/pageAppear";

const EditPlaylistModal = () => {
  const [updatedDetails, setUpdateDetails] = useState({
    name: "",
    description: "",
  });

  const dispatch = useDispatch();
  const { selectedPlaylistId, playlist } = useSelector(
    (state) => state.playlist
  );

  // Populate form with current playlist data when modal opens
  useEffect(() => {
    if (selectedPlaylistId) {
      dispatch(getPlaylistById(selectedPlaylistId));
    }
  }, [selectedPlaylistId, dispatch]);

  // Update form when playlist data is loaded
  useEffect(() => {
    if (playlist) {
      setUpdateDetails({
        name: playlist.name || "",
        description: playlist.description || "",
      });
    }
  }, [playlist]);

  // Handle input changes
  const handleChange = (e) => {
    setUpdateDetails({ ...updatedDetails, [e.target.name]: e.target.value });
  };

  // Handle playlist update
  const handleEdit = async () => {
    if (!updatedDetails.name.trim()) {
      toast.error("Playlist name cannot be empty");
      return;
    }

    try {
      await dispatch(
        updatePlaylist({
          playlistId: selectedPlaylistId,
          updatedDetails,
        })
      ).unwrap();

      toast.success("Playlist updated successfully!");
      dispatch(setIsEditPlaylistModalAppear(false));
    } catch (error) {
      toast.error(error?.message || "Failed to update playlist");
    }
  };

  return (
    // Backdrop covering the full screen
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
      onClick={() => dispatch(setIsEditPlaylistModalAppear(false))} // close when clicking outside
    >
      {/* Modal content */}
      <div
        className="bg-gray-800 rounded-md p-6 w-[90%] max-w-[700px]"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <p className="text-2xl mb-6 font-semibold text-gray-300">
          Update Playlist
        </p>

        <input
          type="text"
          name="name"
          value={updatedDetails.name}
          onChange={handleChange}
          placeholder="Playlist Title"
          className="w-full border border-gray-600 rounded-lg p-3 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <textarea
          name="description"
          value={updatedDetails.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border border-gray-600 rounded-lg p-3 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none mt-4"
          rows="4"
        />

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => dispatch(setIsEditPlaylistModalAppear(false))}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded text-white font-semibold"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlaylistModal;
