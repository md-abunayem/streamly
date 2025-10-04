import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const toggleVideoLike = asyncHandler(async (req, res)=>{
    //video id from params
    //validate video id
    //get user id from req.user
    //check if video id is already liked by user id
    //if yes remove the like
    //if no add the like
    //send response

    const { videoId } = req.params;
    const userId = req.user._id;      // from(JWT)

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id");
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404, "Video not found");
    }

    const existingLike = await Like.findOne({ video: videoId, likedBy: userId})

    if(existingLike){
        //remove like
        await Like.findByIdAndDelete(existingLike._id);

        return res.status(200).json(
            new ApiResponse(200, {isLiked: false}, "Video unliked successfully")
        )
    }else{
        //add like
        await Like.create({
            video: videoId,
            likedBy: userId
        });

        return res.status(200).json(
            new ApiResponse(200, { isLiked: true}, "Video Liked successfully")
        )
    }

});


//toggle comment like
const toggleCommentLike = asyncHandler(async ( req, res)=>{
    const {commentId} = req.params;
    const userId = req.user._id;     // from(JWT)

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment id")
    }

    const comment = await Comment.findById(commentId);

    if(!comment){
        throw new ApiError(404, "Comment not found")
    }

    const existingLike = await Like.findOne(
        { comment: commentId, likedBy: userId}
    );

    if(existingLike){
        //unlike: remove the like
        await Like.findByIdAndDelete(existingLike._id);

        return res.status(200).json(
            new ApiResponse(200, {isLiked: false}, "Comment unliked successfully")
        )
    }else{
        //like: create new like
        await Like.create({
            comment: commentId,
            likedBy: userId
        })

        return res.status(200).json(
            new ApiResponse(
                200,
                {isLiked: true},
                "Comment liked successfully"
            )
        )
    }
})


//toggle tweet like
const toggleTweetLike = asyncHandler( async (req, res)=>{
    const { tweetId } = req.params;
    const userId = req.user._id;     // from(JWT)

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }

    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }

    const existingLike = await Like.findOne(
        { tweet: tweetId, likedBy: userId}
    )

    if(existingLike){
        //unlike: remove the like
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(
            new ApiResponse(200, {isLiked: false}, "Tweet unliked successfully")
        )
    }else{
        //like: create new like
        await Like.create({
            tweet: tweetId,
            likedBy: userId
        })

        return res.status(200).json(
            new ApiResponse(200, {isLiked: true}, "Tweet liked successfully")
        )
    }
 })


 //get all liked videos by a user
 const getLikedVideos = asyncHandler(async (req, res)=>{

    const { page = 1, limit = 20 } = req.query; //Default 20 for infinite scroll

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if(pageNum < 1 || limitNum <1 || limitNum > 50){
        throw new ApiError(400, "Invalid page or limit" )
    }

    const user = req.user._id; // from JWT
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(user),
                video: { $exists: true, $ne: null } // Only video likes
            },
        },
        {
            $lookup:{
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails",
                pipeline: [
                    {
                        $lookup: {

                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                            pipeline: [
                                {
                                    $project: {
                                        userName: 1, 
                                        fullName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        },
                        
                    },
                    {
                        $addFields: {
                            owner: {
                                $first:"$ownerDetails"
                            }
                        }
                    },
                    {
                        $project: {
                            ownerDetails: 0,
                        }
                    }
                ],

            }
        },
        {
            $unwind: "$videoDetails"
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: (pageNum - 1) * limitNum
        },
        {
            $limit: limitNum
        },
        {
            $project: {
                video: "$videoDetails",
                likedAt: "$createdAt",
                _id: 0
            }
        }
        
    ])

    const totalLikedVideos = await Like.countDocuments({
        likedBy: user,
        video: { $exists: true, $ne: null }
    })
    
    const totalPages = Math.ceil(totalLikedVideos / limitNum);

    return res.status(200).json(
        new ApiResponse(
            200, 
            { 
                videos: likedVideos,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalItems: totalLikedVideos,
                    itemsPerPage: limitNum,
                    hasNextPage: pageNum < totalPages,
                    hasPrevPage: pageNum > 1

                }
            }, 
            "Liked videos fetched successfully"
        )
    )
 })


export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}