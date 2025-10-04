import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req.user?._id; //from JWT

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const stats = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "videoLikes",
      },
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
        totalLikes: { $sum: { $size: "$videoLikes" } },
      },
    },
  ]);

  const subscriberCount = await Subscription.countDocuments({
    channel: userId,
  });

  const channelStats = {
    totalVideos: stats[0]?.totalVideos || 0,
    totalLikes: stats[0]?.totalLikes || 0,
    totalViews: stats[0]?.totalViews || 0,
    totalSubscribers: subscriberCount,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, channelStats, "Channel stats fetched successfully")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const userId = req.user?._id; //From JWT

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const sortOptions = {};
  sortOptions[sortBy] = sortType === "asc" ? 1 : -1;

  const videoAggregate = Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        //add likes to the videos according to the videos
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $addFields: {
        likesCount: {
          $size: "$likes",
        },
      },
    },
    {
      $project: {
        likes: 0,
      },
    },
    {
      $sort: sortOptions,
    },
    {
      $skip: skip
    }
  ]);

  const options = {
    page: pageNum,
    limit: limitNum,
  };

  const videos = await Video.aggregatePaginate(videoAggregate, options);

  if (!videos) {
    throw new ApiError(500, "Failed to fetch channel videos");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
