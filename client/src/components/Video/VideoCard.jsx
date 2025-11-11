import { calculateViews } from "../../../utils/calculateViews_and_Subscribers";
import { calculatePublishTime } from "../../../utils/calculatePublishTime";
import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video._id}`}>
      <div className="flex mb-4 bg-gray-800 rounded-2xl mx-4">
        <video
          src={video.videoFile}
          muted
          loop
          onMouseEnter={(e) => e.target.play()}
          onMouseLeave={(e) => e.target.pause()}
          poster={video.thumbnail}
          className="object-cover w-[50%]"
        ></video>
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

export default VideoCard;
