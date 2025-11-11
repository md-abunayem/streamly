import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPlaylist } from "../../redux/slices/playlistSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setAddVidoeToPlaylistAppear } from "../../redux/slices/pageAppear";

const CreatePlaylist = ({ setCreatePlaylistAppear }) => {
  const [playlistData, setPlaylistData] = useState({
    name: "",
    description: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAddVideoToPlaylistApear } = useSelector((state) => state.pageAppear);

  // Handle input changes
  const handleChange = (e) => {
    setPlaylistData({ ...playlistData, [e.target.name]: e.target.value });
  };

  // Handle playlist creation
  const handleCreate = async () => {
    try {
      await dispatch(createPlaylist(playlistData)).unwrap();

      // Close modal after success
      setCreatePlaylistAppear(false);
      dispatch(setAddVidoeToPlaylistAppear(true));
      console.log(isAddVideoToPlaylistApear)
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    // Backdrop covering the full screen
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
      onClick={() => setCreatePlaylistAppear(false)} // close when clicking outside
    >
      {/* Modal content */}
      <div
        className="bg-gray-800 rounded-md p-6 w-[90%] max-w-[700px]"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <p className="text-2xl mb-6 font-semibold text-gray-300">
          Create Playlist
        </p>

        <input
          type="text"
          name="name"
          value={playlistData.name}
          onChange={handleChange}
          placeholder="Playlist Title"
          className="w-full border border-gray-600 rounded-lg p-3 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <textarea
          name="description"
          value={playlistData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border border-gray-600 rounded-lg p-3 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none mt-4"
          rows="4"
        />

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => setCreatePlaylistAppear(false)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded text-white font-semibold"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;
