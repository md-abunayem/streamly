import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { VolumeX, Volume2 } from "lucide-react";
import { calculatePublishTime } from "../../../utils/calculatePublishTime";

const VideoThumbanailCard = ({ video }) => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };
  return (
    <div onClick={() => navigate(`/video/${video._id}`)} className="text-white">
      {/* Thumbnail */}
      <div className="relative w-full h-52 lg:h-72 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
        <video
          src={video.videoFile}
          poster={video.thumbnail}
          className="object-cover h-full w-full"
          muted={isMuted}
          loop
          onMouseEnter={(e) => e.target.play()}
          onMouseLeave={(e) => e.target.pause()}
        ></video>
        <div
          onClick={toggleMute}
          className="absolute top-2 right-2 bg-black/50 p-2 rounded-full cursor-pointer hover:bg-black/70"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </div>
        <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded-md">
          {Math.round(video.duration)}s
        </span>
      </div>
      <div className="flex mt-4">
        <div className="h-12 w-12 rounded-full">
          <img
            src={video.ownerDetails.avatar}
            alt=""
            className="rounded-full w-full h-full object-cover"
          />
          {/* <p>{video.title}</p>
        <img src="" alt="" /> */}
        </div>
        <div className="ml-4">
          <p className="text-2xl">{video.title}</p>
          <p className={`text-[1.1rem] text-gray-400 font-semibold`}>
            {video.ownerDetails.fullName}
          </p>
          <div className="flex text-gray-400">
            <p>{video.views} views</p>
            <p className="mx-2 relative bottom-2 font-bold">.</p>
            <p>{calculatePublishTime(video.createdAt)} </p>
            {/* <p>{video.}</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoThumbanailCard;
