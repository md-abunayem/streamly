import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPlaylistById } from "../../redux/slices/playlistSlice";
import PlaylistVideoCard from "../../components/Playlist/PlaylistVideoCard";

const PlaylistVideosPage = () => {
  const { playlistId } = useParams();
  const dispatch = useDispatch();
  const { playlist, loading } = useSelector((state) => state.playlist);

  useEffect(() => {
    if (playlistId) dispatch(getPlaylistById(playlistId));
  }, [playlistId, dispatch]);

  if (loading) return <p className="text-white p-4">Loading...</p>;
  if (!playlist) return <p className="text-white p-4">Playlist not found</p>;

  return (
    <div className="w-[100vw] min-h-auto mt-4 md:mt-0 p-4 md:p-8 flex flex-col lg:flex-row text-white justify-center lg:justify-start ">
      {/* Info about playlist */}
      <div
        className={`w-full lg:w-[32%] lg:h-[80vh]  bg-gradient-to-b from-pink-900 via-purple-500 to-indigo-500 p-8 rounded-2xl lg:sticky lg:top-28`}
      >
        <div className="w-full ">
          <img
            src={playlist?.videos[0]?.thumbnail}
            alt="video image"
            className="w-full lg:max-h-56 md:max-h-65 rounded-2xl"
          />
        </div>
        <p className="mt-4 lg:text-2xl font-bold text-gray-200 md:text-3xl">
          {playlist.name}
        </p>
        <div className="flex items-center my-2">
          <img
            src={playlist.owner.avatar}
            alt="owner"
            className="h-8 w-8 rounded-full mr-4"
          />{" "}
          <p className="text-sm font-semibold">by {playlist.owner.fullName}</p>
        </div>
        <p>
          playlist • {playlist.totalVideos} videos • {playlist.totalViews} views
        </p>
      </div>

      {/* videos of the playlist*/}
      <div className="ml-3 flex-1 overflow-x-auto flex  flex-col justify-start gap-4 lg:pl-4 h-auto ">
        {playlist &&
          playlist.videos.map((video) => (
            <PlaylistVideoCard video={video} key={video._id} />
          ))}
      </div>
    </div>
  );
};

export default PlaylistVideosPage;
