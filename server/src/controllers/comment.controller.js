import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";

//get all comment for a video - pagination, sorting, latest first
const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const commentsAggregate = Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },

    // Lookup video details
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    userName: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          { $unwind: "$owner" }, // attach video owner
          {
            $project: {
              title: 1,
              thumbnail: 1,
              duration: 1,
              views: 1,
              videoFile: 1,
              description: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$video" },

    // Lookup comment owner details
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              userName: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$owner" },

    // Sort latest first
    {
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1,
      },
    },
  ]);

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const comments = await Comment.aggregatePaginate(commentsAggregate, options);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments: comments.docs,
        pagination: {
          currentPage: comments.page,
          totalPages: comments.totalPages,
          totalComments: comments.totalDocs,
          hasNextPage: comments.hasNextPage,
          hasPrevPage: comments.hasPrevPage,
        },
      },
      "Comments fetched successfully"
    )
  );
});

//add comment
const addComment = asyncHandler(async (req, res) => {
  //video id from params
  //content from body
  //owner from JWT
  //validation - video id, content (not empty)
  //check video exist or not
  //create comment
  //send response

  const { videoId } = req.params;
  const { content } = req.body;
  const owner = req.user._id; // from(JWT)

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  if (!content || !content.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const comment = await Comment.create({
    content: content.trim(),
    video: videoId,
    owner,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

//update comment
const updateComment = asyncHandler(async (req, res) => {
  //comment od from params
  //content from body
  //owner from JWT
  //validation - comment id, content (not empty)
  //check comment exist or not
  //check owner is same as JWT user
  //update comment
  //send response

  const { commentId } = req.params;
  const { content } = req.body;
  const owner = req.user._id; // from(JWT)

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  if (!content || !content.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== owner.toString()) {
    throw new ApiError(403, "You are not authorized to update this comment");
  }

  comment.content = content.trim();
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

//delete comment
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const owner = req.user._id; // from(JWT)

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== owner.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

export { 
    getVideoComments,
    addComment, 
    updateComment, 
    deleteComment 
};
