import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchAllVideos } from "../../redux/slices/videoSlice";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import VideoThumbnailCard from "../../components/Video/VideoThumbnailCard";

const HomePage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  
  // extract q from URL
  const q = searchParams.get("q") || "";

  const { isLoading, errorMessage, videos } = useSelector(
    (state) => state.video
  );

  //can search by title, channel name
  useEffect(() => {
    // Pass as 'query' to match backend
    dispatch(fetchAllVideos({ query: q }));
  }, [dispatch, q]);

  return (
    <div className="h-full w-full p-6">
      {isLoading && <LoadingSpinner />}
      {errorMessage && <ErrorMessage message={errorMessage} />}

      {!isLoading && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoThumbnailCard key={video._id} video={video} />
          ))}
        </div>
      )}

      {!isLoading && !videos.length && (
        <p className="text-center text-gray-400 mt-10 text-lg">
          No videos found for "<span className="font-semibold">{q}</span>"
        </p>
      )}
    </div>
  );
};

export default HomePage;
