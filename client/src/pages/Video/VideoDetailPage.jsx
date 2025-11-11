import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getVideoById } from "../../redux/slices/videoSlice";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

import VideoPlayerCard from "../../components/Video/VideoPlayerCard";
import RelatedVideos from "../../components/Video/RelatedVideos";
import CommentSection from "../../components/Video/CommentSection";

const VideoDetailPage = () => {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const { isLoading, errorMessage, selectedVideo } = useSelector(
    (state) => state.video
  );

  useEffect(() => {
    dispatch(getVideoById(videoId));
  }, [dispatch, videoId]);

  return (
    <>
      {isLoading && (
        <div className="h-screen w-full">
          <LoadingSpinner />
        </div>
      )}
      {errorMessage && <ErrorMessage />}
      <div className="w-screen lg:flex lg:justify-between lg:pr-16 ">
        <div className="w-full">
          <VideoPlayerCard />
          <div className="lg:w-[40%] w-full lg:mt-4 lg:hidden">
            <RelatedVideos />
          </div>
          <CommentSection videoId={videoId} />
        </div>
        <div className="lg:w-[40%] w-full lg:mt-4 hidden lg:block">
          <RelatedVideos />
        </div>
      </div>
    </>
  );
};

export default VideoDetailPage;
