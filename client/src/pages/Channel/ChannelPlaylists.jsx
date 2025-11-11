import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPlaylists } from "../../redux/slices/playlistSlice";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { EllipsisVertical } from "lucide-react";
import {
  setAddVidoeToPlaylistAppear,
  setIsEditPlaylistModalAppear,
} from "../../redux/slices/pageAppear";
import { setSelectedPlaylistId } from "../../redux/slices/playlistSlice";
import { deletePlaylist } from "../../redux/slices/playlistSlice";
import { toast } from "react-toastify";

const ChannelPlaylists = () => {
  const dispatch = useDispatch();
  const { playlists, loading } = useSelector((state) => state.playlist);
  const { channel } = useSelector((state) => state.user);
  

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    if (channel?._id) {
      dispatch(getUserPlaylists(channel._id));
    }
  }, [channel, dispatch]);

  // click outside to close
  useEffect(() => {
    const handle = (e) => {
      if (
        openMenuId &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId].contains(e.target)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [openMenuId]);

  const openAddVideoModal = (playlistId) => {
    dispatch(setSelectedPlaylistId(playlistId)); // save playlist ID in playlist slice
    dispatch(setAddVidoeToPlaylistAppear(true)); // open modal
    setOpenMenuId(null); // close menu
  };

  //Edit playlist (title, description)
  const openEditPlaylistModel = (playlistId) => {
    dispatch(setSelectedPlaylistId(playlistId));
    dispatch(setIsEditPlaylistModalAppear(true));
    setOpenMenuId(null);
  };

  //delete playlist
  const handleDeletePlaylist = async (playlistId) => {
    try {
      await dispatch(deletePlaylist(playlistId)).unwrap();
      toast.success("Playlist deleted");
      setOpenMenuId(null);
      await dispatch(getUserPlaylists(channel._id));
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="w-full min-h-auto p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
        Playlists
      </h2>

      {loading && <LoadingSpinner />}

      {!loading && playlists?.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-lg">No playlists yet</p>
          <p className="text-sm">Create a playlist to organize your videos</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists?.map((pl) => (
          <div key={pl._id} className="relative group">
            <Link
              to={`/playlist/${pl._id}`}
              className="block bg-gray-800 hover:bg-gray-700 transition rounded-lg overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative h-40 bg-black">
                {pl.videos?.length > 0 ? (
                  <img
                    src={pl.videos[0].thumbnail}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No Thumbnail
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
                <p className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {pl.videos?.length || 0} videos
                </p>
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold text-lg truncate">
                  {pl.name}
                </h3>
                <p className="text-gray-400 text-sm truncate">
                  {pl.description || "No description"}
                </p>
              </div>
            </Link>

            {/* Menu Button */}
            <div
              ref={(el) => (menuRefs.current[pl._id] = el)}
              className="absolute top-2 right-2 z-20"
            >
              <EllipsisVertical
                className="text-white cursor-pointer opacity-0 group-hover:opacity-100 transition"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenMenuId(openMenuId === pl._id ? null : pl._id);
                }}
              />

              {/* Dropdown Menu */}
              {openMenuId === pl._id && (
                <div className="absolute top-10 right-0 z-30 bg-gray-900 text-white text-sm rounded-lg shadow-lg p-2 w-36">
                  <button
                    onClick={() => openAddVideoModal(pl._id)}
                    className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded"
                  >
                    Add Video
                  </button>
                  <button
                    onClick={() => openEditPlaylistModel(pl._id)}
                    className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded"
                  >
                    Edit Playlist
                  </button>
                  <button
                    onClick={() => handleDeletePlaylist(pl._id)}
                    className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelPlaylists;
