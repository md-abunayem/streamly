import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddVidoeToPlaylistAppear } from "../../redux/slices/pageAppear";
import { addVideoToPlaylist } from "../../redux/slices/playlistSlice";
import { toast } from "react-toastify";

const AddVideoToPlaylist = () => {
  const dispatch = useDispatch();

  const { videos } = useSelector((state) => state.video);

  // previous logic (playlist created)
  const { playlist, selectedPlaylistId } = useSelector(
    (state) => state.playlist
  );

  const [selectedVideos, setSelectedVideos] = useState([]);
  const [finalPlaylistId, setFinalPlaylistId] = useState(null);

  // MERGED LOGIC: detect which playlist ID should be used
  useEffect(() => {
    if (playlist?._id) {
      setFinalPlaylistId(playlist._id); // newly created playlist
    } else if (selectedPlaylistId) {
      setFinalPlaylistId(selectedPlaylistId); // selected playlist
    } else {
      setFinalPlaylistId(null);
    }
  }, [playlist, selectedPlaylistId]);

  const toggleVideos = (videoId) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleAdd = async () => {
    if (selectedVideos.length === 0) return;

    if (!finalPlaylistId) {
      toast.info("No playlist selected!");
      return;
    }

    try {
      await Promise.all(
        selectedVideos.map((videoId) =>
          dispatch(
            addVideoToPlaylist({
              videoId,
              playlistId: finalPlaylistId, // merged final id
            })
          )
        )
      );

      dispatch(setAddVidoeToPlaylistAppear(false));
      toast.success("Videos added successfully!");
    } catch (error) {
      toast.error(error?.message || "Failed to add videos");
    }
  };

  return (
    <div
      role="dialog"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
    >
      <div className="bg-gray-800 rounded-lg p-6 w-[90%] max-w-[700px]">
        <h2 className="text-xl font-semibold text-white mb-4">
          Add to Playlist
        </h2>

        <div className="max-h-[400px] overflow-y-auto flex flex-col gap-3">
          {videos?.map((video) => (
            <div
              key={video._id}
              className="flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer"
            >
              <video
                src={video.videoFile}
                className="h-20 w-36 object-cover rounded"
              ></video>

              <div className="ml-4 flex-1">
                <p className="text-white font-medium">{video.title}</p>
              </div>

              <input
                type="checkbox"
                checked={selectedVideos.includes(video._id)}
                onChange={() => toggleVideos(video._id)}
                className="w-5 h-5 accent-pink-500"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
            onClick={() => dispatch(setAddVidoeToPlaylistAppear(false))}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded text-white"
            onClick={handleAdd}
            disabled={selectedVideos.length === 0}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVideoToPlaylist;
