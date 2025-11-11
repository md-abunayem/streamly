import { useState } from "react";
import { Link } from "react-router-dom";
import { VolumeX, Volume2 } from "lucide-react";

import { calculatePublishTime } from "../../../utils/calculatePublishTime";
import { calculateViews } from "../../../utils/calculateViews_and_Subscribers";

const ChannelVideoCard = ({ video }) => {
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };
  return (
    <Link to={`/video/${video._id}`}>
      <div className="mb-4 bg-gray-800 rounded-2xl mx-4 h-80">
        <div className="relative h-[60%]">
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
          <span className="absolute right-2 bottom-2 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded-md">
            {Math.round(video.duration)}s
          </span>
        </div>

        <div className="text-white pl-4 pt-2">
          <p className="text-[1.1rem] font-semibold">{video.title}</p>
          <p className="text-gray-400 font-semibold">
            {video.ownerDetails.fullName}
          </p>
          <div className="flex">
            <p className="">{calculateViews(video.views)}</p>
            <p className="px-2">•</p>
            <p>{calculatePublishTime(video.createdAt)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ChannelVideoCard;
