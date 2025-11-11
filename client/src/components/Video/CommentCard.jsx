import React, { useState } from "react";
import { ThumbsUp, EllipsisVertical, Pencil, Trash2 } from "lucide-react";

const CommentCard = ({ comment, onDeleteComment, onEditComment }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleActions = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="mt-4 flex items-start justify-between bg-gray-800 rounded-md px-3 py-2">
      {/* Profile & Comment */}
      <div>
        <div className="flex space-x-4">
          <div className="h-10 w-10 md:h-12 md:w-12">
            <img
              src={comment.owner.avatar}
              alt="Profile"
              className="h-full w-full object-cover rounded-full"
            />
          </div>

          <div>
            <p className="text-blue-400 font-semibold">
              @{comment.owner.userName}
            </p>
            <p className="text-gray-100">{comment.content}</p>
          </div>
        </div>
        <button type="button">
          <ThumbsUp className="mt-2 ml-17"></ThumbsUp>
        </button>
      </div>

      {/* Three Dot Menu */}
      <div className="relative">
        <button
          type="button"
          onClick={handleActions}
          className="p-1 hover:bg-gray-600 rounded-full"
        >
          <EllipsisVertical size={20} />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-700 rounded-md text-gray-100"
              onClick={() => onEditComment(comment)}
            >
              <Pencil size={16} />
              Edit
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-700 rounded-md text-red-400"
              onClick={() => onDeleteComment(comment)}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
