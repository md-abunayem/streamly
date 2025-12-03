import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserTweets } from "../../redux/slices/tweetSlice";
import TweetCard from "../../components/Tweet/TweetCard";
const ChannelTweets = () => {
  const dispatch = useDispatch();
  const tweets = useSelector((state) => state.tweet?.tweets || []);
  const channel = useSelector((state) => state.user?.channel);

  // Fetch tweets when the channel changes
  useEffect(() => {
    if (!channel?._id) return;
    dispatch(getUserTweets(channel._id));
  }, [dispatch, channel?._id]); // run only when dispatch or channel ID changes

  return (
    <div className="space-y-4">
      {tweets.length === 0 && (
        <p className="text-center text-gray-400">No tweets to display.</p>
      )}
      {tweets.map((tweet) => (
        <TweetCard key={tweet._id} tweet={tweet} />
      ))}
    </div>
  );
};

export default ChannelTweets;
