import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createVideoComment,
  getAllComments,
  updateComment,
  deleteComment,
  clearSuccess,
  clearError,
} from "../../redux/slices/commentSlice";
import { CircleUser } from "lucide-react";
import { toast } from "react-toastify";
import CommentCard from "./CommentCard";

const CommentSection = ({ videoId }) => {
  const dispatch = useDispatch();
  const [userComment, setUserComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { allComments, isLoading, errorMessage, successMessage } = useSelector(
    (state) => state.comment
  );

  //handle comment input
  const handleCommentChange = (event) => {
    setUserComment(event.target.value);
  };

  //submit or update comment
  const handleSubmitComment = () => {
    if (!isAuthenticated) {
      toast.info("You have to login to submit comment.");
      return;
    }

    if (!userComment.trim()) {
      toast.warning("Comment cannot be empty.");
      return;
    }

    if (editingCommentId) {
      //update existing comment
      dispatch(
        updateComment({ commentId: editingCommentId, content: userComment })
      )
        .then(() => dispatch(getAllComments(videoId)))
        .finally(() => {
          setUserComment("");
          setEditingCommentId(null);
        });
    } else {
      dispatch(createVideoComment({ videoId, content: userComment })).then(() =>
        dispatch(getAllComments(videoId))
      );
      setUserComment("");
    }
  };

  //fetch all comments
  useEffect(() => {
    if (videoId) {
      dispatch(getAllComments(videoId));
    }
  }, [dispatch, videoId]);

  //Edit Comment
  const handleEditComment = (comment) => {
    if (comment?.owner?._id !== user?._id) {
      toast.info("You can not edit others people's comments");
      return;
    }
    setUserComment(comment.content);
    setEditingCommentId(comment?._id);
  };

  //Delete Comment
  const handleDeleteComment = (comment) => {
    if (comment?.owner?._id !== user?._id) {
      toast.info("You can not delete others people's comments");
      return;
    }
    dispatch(deleteComment(comment._id)).then(() =>
      dispatch(getAllComments(videoId))
    );
  };

  //handle success and error message
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(clearError());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccess());
    }
  }, [errorMessage, successMessage, dispatch]);

  return (
    <div className="lg:max-w-full px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-4 lg:px-8 lg:py-4 xl:px-12 flex flex-col text-white">
      {/* Headline */}
      <p className="text-white sm:text-xl md:text-2xl lg:text-3xl font-semibold">
        Comments
      </p>

      {/* //Comment input */}
      <div>
        <div className="mt-4 flex space-x-4">
          {isAuthenticated ? (
            <div className="h-8 w-8 md:h-12 md:w-12 rounded-full ">
              <img
                src={user?.avatar}
                alt="User Photo"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="h-8 w-8 md:h-12 md:w-12 rounded-full border-2 border-blue-800 justithy-center items-center">
              <CircleUser className="h-full w-full text-blue-500" />
            </div>
          )}
          <input
            type="text"
            name="content"
            value={userComment}
            id="comment"
            className="bg-transparent placeholder-gray-400 border-b focus:outline-none focus:border-white focus:scale-[1.01] focus:border-b-2 w-full sm:w-full  transition-transform duration-200 "
            placeholder="Write something..."
            onChange={handleCommentChange}
          />
        </div>

        {/* actions */}
        <div className="w-full flex justify-end">
          <button
            type="button"
            className="h-10 mt-4 bg-gray-700 rounded-3xl px-4 relative"
            onClick={handleSubmitComment}
          >
            {editingCommentId ? "Update" : "comment"}
          </button>
        </div>
      </div>
      <div>
        {allComments.map((comment) => (
          <CommentCard
            key={comment._id}
            comment={comment}
            onDeleteComment={handleDeleteComment}
            onEditComment={handleEditComment}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
