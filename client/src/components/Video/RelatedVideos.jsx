import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllVideos, clearError } from "../../redux/slices/videoSlice";
import { toast } from "react-toastify";
import VideoCard from "./VideoCard";
import { getRandomVideos } from "../../../utils/getRandomVideos";

const RelatedVideos = ({ videoId }) => {
  const dispatch = useDispatch();
  const { selectedVideo, videos, errorMessage } = useSelector(
    (state) => state.video
  );
  const [randomVideos, setRandomVideos] = useState([]);

  // Fetch videos once on mount
  useEffect(() => {
    dispatch(fetchAllVideos());
  }, [dispatch]);

  //Chose Random Videos
  useEffect(() => {
    if (videos) {
      setRandomVideos(getRandomVideos(videos, selectedVideo?._id, 6));
    }
  }, [dispatch,selectedVideo]);

  // Handle only errors for background fetches
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(clearError());
    }
  }, [errorMessage, dispatch]);

  return (
    <div className="grid lg:grid-cols-1 grid-cols-2 mx-4">
      {randomVideos.map((video) => (
        <VideoCard key={video._id} video={video} excludeVideo={videoId} />
      ))}
    </div>
  );
};

export default RelatedVideos;
