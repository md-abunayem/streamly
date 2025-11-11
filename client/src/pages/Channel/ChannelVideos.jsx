import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchUserVideos } from "../../redux/slices/videoSlice";
import ChannelVideoCard from "../../components/Video/ChannelVideoCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

const ChannelVideos = () => {
  const dispatch = useDispatch();
  const { videos, isLoading, errorMessage } = useSelector(
    (state) => state.video
  );
  const { channel } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserVideos(channel?._id));
  }, [dispatch, channel]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {errorMessage && <ErrorMessage />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {videos.map((video) => (
          <ChannelVideoCard video={video} key={video._id} />
        ))}
      </div>
    </>
  );
};

export default ChannelVideos;
