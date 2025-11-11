import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ThumbsUp, Forward, Download } from "lucide-react";

import { calculateSubscribers } from "../../../utils/calculateViews_and_Subscribers";
import {
  toggleSubscription,
  getUserChannelSubscribers,
} from "../../redux/slices/SubscriptionSlice";

const VideoPlayerCard = () => {
  const dispatch = useDispatch();
  const { selectedVideo, errorMessage } = useSelector((state) => state.video);
  const { subscribers } = useSelector((state) => state.subscription);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const { videoFile, thumbnail, title, description, owner, ownerDetails } =
    selectedVideo || {};

  // Handle errors
  useEffect(() => {
    if (errorMessage) toast.error(errorMessage);
  }, [errorMessage]);

  // Fetch channel subscribers when video owner changes
  useEffect(() => {
    if (owner) dispatch(getUserChannelSubscribers(owner));
  }, [owner, dispatch]);

  // Check if the current user is subscribed
  const isSubscribed =
    subscribers?.some((sub) => sub.subscriber === user?._id) || false;

  const handleToggleSubscribe = () => {
    if (!isAuthenticated) {
      toast.info("Please login to subscribe");
      return;
    }
    if (!owner) return;

    dispatch(toggleSubscription(owner)).then(() => {
      dispatch(getUserChannelSubscribers(owner));
    });
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.info("Please login to like this video");
      return;
    }
    toast.success("You liked this video! 👍");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: "Check out this video!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Video link copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (!videoFile) return;
    const link = document.createElement("a");
    link.href = videoFile;
    link.download = title || "video.mp4";
    link.click();
  };

  return (
    <div className="px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-4 lg:px-8 lg:py-4 xl:px-12 flex flex-col text-white">
      {/* Video Player */}
      {videoFile ? (
        <video
          src={videoFile}
          poster={thumbnail}
          autoPlay
          controls
          className="w-full aspect-video max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh] lg:max-h-[68vh] xl:max-h-[71vh] rounded-lg md:rounded-xl lg:rounded-2xl object-cover"
        />
      ) : (
        <div className="w-full aspect-video bg-gray-800 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center">
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">
            No video selected
          </p>
        </div>
      )}

      {/* Video Information Section */}
      <div className="mt-3 sm:mt-4 md:mt-5 space-y-3 sm:space-y-4">
        {/* Video Title */}
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-tight break-words">
          {title || "Untitled Video"}
        </h1>

        {/* Owner & Actions Container */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start md:items-center gap-3 sm:gap-4">
          {/* Owner Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0">
              <img
                src={ownerDetails?.avatar || "/default-avatar.png"}
                alt={ownerDetails?.fullName || "Creator"}
                className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-14 lg:w-14 object-cover rounded-full"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold truncate">
                {ownerDetails?.fullName || "Unknown Creator"}
              </p>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 font-medium">
                {calculateSubscribers(subscribers?.length)}
              </p>
            </div>

            {/* Subscribe Button - Desktop */}
            <button
              onClick={handleToggleSubscribe}
              className="hidden sm:flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-black font-semibold px-4 md:px-5 lg:px-6 h-9 md:h-10 rounded-full transition-colors text-sm md:text-base whitespace-nowrap"
            >
              {isSubscribed ? "Unfollow" : "Follow"}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Subscribe Button - Mobile */}
            <button
              onClick={handleToggleSubscribe}
              className="sm:hidden flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-black font-semibold px-4 h-9 rounded-full transition-colors text-sm flex-1 min-w-[100px]"
            >
              {isSubscribed ? "Unfollow" : "Follow"}
            </button>

            {/* Like Button */}
            <button
              onClick={handleLike}
              className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-black h-9 md:h-10 w-12 md:w-14 rounded-full transition-colors flex-shrink-0"
              aria-label="Like video"
            >
              <ThumbsUp className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 bg-gray-200 hover:bg-gray-300 text-black font-semibold px-3 md:px-4 h-9 md:h-10 rounded-full transition-colors text-sm md:text-base whitespace-nowrap"
            >
              <Forward className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-1.5 bg-gray-200 hover:bg-gray-300 text-black font-semibold px-3 md:px-4 lg:px-5 h-9 md:h-10 rounded-full transition-colors text-sm md:text-base whitespace-nowrap"
            >
              <Download className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Video Description */}
        <div className="relative border border-gray-700/60 bg-gray-900/70 backdrop-blur-md rounded-xl p-5 pt-7 shadow-lg shadow-gray-900/40 transition duration-300 hover:shadow-gray-800/70 mt-10">
          {/* Title */}
          <span
            className="absolute top-0 left-[1.5%] -translate-y-1/2 
               bg-gray-900 px-3 py-0.5 text-gray-200 text-sm sm:text-base 
               font-semibold tracking-wide uppercase border border-gray-700/60 
               rounded-full shadow-sm"
          >
            Description
          </span>

          {/* Content */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-300/90 leading-relaxed whitespace-pre-wrap break-words">
            {description || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerCard;
