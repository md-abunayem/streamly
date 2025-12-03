import React from "react";

// A simple tweet card component
const TweetCard = ({ tweet }) => {
  // Format createdAt for Dhaka time zone
  const formattedDate = new Date(tweet.createdAt).toLocaleString("en-US", {
    timeZone: "Asia/Dhaka",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <article
      className="mb-4 rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-sm transition-colors hover:bg-gray-700"
    >
      {/* Header section */}
      <header className="mb-2 flex items-start justify-between">
        <div>
          {/* Replace with actual avatar and name if available */}
          <h3 className="font-semibold text-gray-100">
            Owner: <span className="font-mono">{tweet.owner.slice(0, 8)}…</span>
          </h3>
          <time className="block text-sm text-gray-400">{formattedDate}</time>
        </div>
      </header>

      {/* Content section */}
      <p className="text-gray-200">{tweet.content}</p>
    </article>
  );
};

export default TweetCard;
