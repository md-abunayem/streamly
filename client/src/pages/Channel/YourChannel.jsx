import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, NavLink, Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { fetchUserChannel } from "../../redux/slices/userSlice";
import {
  calculateSubscribers,
  calculateFollowing,
} from "../../../utils/calculateViews_and_Subscribers";
import ChannelPopUP from "../../components/Channel/ChannelPopUP";
import CreatePlaylist from "../../components/Playlist/CreatePlaylist";
import AddVideoToPlaylist from "../../components/Playlist/AddVideoToPlaylist";
import EditPlaylistModal from "../../components/Playlist/editPlaylistModal";
import CreateTweet from "../../components/Tweet/CreateTweet";

const YourChannel = () => {
  const dispatch = useDispatch();
  const { channel } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const { isEditPlaylistModalAppear } = useSelector(
    (state) => state.pageAppear
  );
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [createPlaylistAppear, setCreatePlaylistAppear] = useState(false);

  const { isAddVideoToPlaylistApear,isCreateTweetAppear } = useSelector((state) => state.pageAppear);


  useEffect(() => {
    if (user?.userName) {
      dispatch(fetchUserChannel(user.userName));
    }
  }, [dispatch, user?.userName]);

  return (
    <div className="text-white min-h-screen bg-black">
      {/* ===== Cover Image Section ===== */}
      <div className="relative w-full h-[25vh]">
        {channel?.coverImage ? (
          <img
            src={channel.coverImage}
            alt="Cover Image"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
        )}

        {/* ===== Avatar Section (overlapping) ===== */}
        <div className="absolute -bottom-27 left-6 md:left-12 z-10 flex items-end gap-4">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white overflow-hidden shadow-lg">
            <img
              src={channel?.avatar || "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="pb-2">
            <h1 className="text-2xl font-bold">
              {channel?.fullName || "Full Name"}
            </h1>
            <p className="text-gray-400">@{channel?.userName || "username"}</p>
            <div className="flex gap-6 text-gray-400 text-sm mt-1">
              <p>
                <span className="font-semibold text-white">
                  {calculateSubscribers(channel?.subscribersCount) || 0}
                </span>{" "}
              </p>
              <p>
                <span className="font-semibold text-white">
                  {calculateFollowing(channel?.channelsSubscribedToCount) || 0}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Render CreatePlaylist Window */}
      {createPlaylistAppear && (
        <CreatePlaylist setCreatePlaylistAppear={setCreatePlaylistAppear} />
      )}

      {/* Render AddToPlaylist window */}
      {isAddVideoToPlaylistApear && <AddVideoToPlaylist />}

      {/* Render EditPlaylist window */}
      {isEditPlaylistModalAppear && <EditPlaylistModal />}

      {/* Render Create Tweet window */}
      {isCreateTweetAppear && <CreateTweet/>}

      {/* ===== Tabs Section ===== */}
      <div className="mt-32 ml-6 md:ml-12 relative">
        <div className="absolute -top-24 right-6 md:right-12">
          <button
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="flex justify-center items-center bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            <Plus className="mr-1 font-bold" />
            Create
          </button>

          {/* Popup Menu */}
          {showCreateMenu && (
            <ChannelPopUP
              setShowCreateMenu={setShowCreateMenu}
              setCreatePlaylistAppear={setCreatePlaylistAppear}
            />
          )}
        </div>

        <div className="mt-6 flex justify-around gap-6 border-b border-gray-700 pb-2 mr-12">
          <NavLink
            to="/your-channel/videos"
            className={({ isActive }) =>
              isActive
                ? "text-pink-400 border-b-2 border-pink-400"
                : "hover:text-pink-400"
            }
          >
            Videos
          </NavLink>
          <NavLink
            to="/your-channel/playlists"
            className={({ isActive }) =>
              isActive
                ? "text-pink-400 border-b-2 border-pink-400"
                : "hover:text-pink-400"
            }
          >
            Playlists
          </NavLink>
          <NavLink
            to="/your-channel/tweets"
            className={({ isActive }) =>
              isActive
                ? "text-pink-400 border-b-2 border-pink-400"
                : "hover:text-pink-400"
            }
          >
            Tweets
          </NavLink>
          <NavLink
            to="/your-channel/following"
            className={({ isActive }) =>
              isActive
                ? "text-pink-400 border-b-2 border-pink-400"
                : "hover:text-pink-400"
            }
          >
            Following
          </NavLink>
        </div>
      </div>

      {/* ===== Content Section (Outlet renders here) ===== */}
      <div className="mt-6 ml-6 md:ml-12 mr-6 md:mr-12">
        <Outlet />
      </div>

      {showCreateMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowCreateMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default YourChannel;
