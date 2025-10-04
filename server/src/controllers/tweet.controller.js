import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose,{ isValidObjectId } from "mongoose";



// Create a new tweet
const createTweet = asyncHandler(async (req, res)=>{
    //get tweet data from req.body
    //validate tweet data
    //get user id from JWT
    //create tweet object
    //save tweet to db
    //return response

    const {content} = req.body;

    if(!content || content.trim() === ""){
        throw new ApiError(400, "Content is required")
    }

    const ownerId = req.user._id;   //ownerId from JWT

    const tweet = await Tweet.create({
        content,
        owner: ownerId
    });

    // tweet.save();  //no need to call save() when using create()

    return res.status(201).json(
        new ApiResponse(201, tweet, "Tweet created successfully")
    )
})


//get all tweets of a user
const getUserTweets = asyncHandler(async (req, res)=>{
    //get user id from params
    //validate user id
    //find tweets by user id
    //return response

    const userId = req.params.userId || req.user._id;

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id")
    }

    const tweets = await Tweet.find({owner: userId}).populate("owner", "username fullName avatar").sort({createdAt: -1});  //latest first
    //.populate is used to get user details from user id in owner field

    return res.status(200).json(
        new ApiResponse(200, tweets, "Tweets fetched successfully")
    )
});

//update a tweet(only owner can update)
const updateTweet = asyncHandler (async (req, res)=>{
    //get tweet id from params
    //validate tweet id
    //get new content from req.body
    //find tweet by id
    //check if tweet exists
    //check if user is owner of tweet
    //update tweet content
    //save tweet
    //return response

    const { tweetId } = req.params;
    const { content } = req.body;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }

    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }

    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to update this tweet")
    }

    if(!content || content.trim() === ""){
        throw new ApiError(400, "Content is required")
    }

    tweet.content = content;
    await tweet.save();

    return res.status(200).json(
        new ApiResponse(200, tweet, "Tweet updated successfully")
    )
})


//delete tweet (only owner can delete)
const deleteTweet = asyncHandler(async (req, res)=>{
    //get tweet id from params
    //validate tweet id
    //validate user is owner of tweet
    //delete tweet
    //return response

    const { tweetId } = req.params;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }

    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }

    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to delete this tweet")
    }

    await Tweet.deleteOne({_id: tweetId});

    return res.status(200).json(
        new ApiResponse(200, {}, "Tweet deleted successfully")
    )
})


export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}