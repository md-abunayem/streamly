import mongoose,{ isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//Toggle subscription (subscribe/unsubscribe)
const toggleSubscription = asyncHandler(async (req, res)=>{
    //get channel id from params
    //validate channel id
    //get user id from JWT
    //check if user is subscribing to themselves
    //check if subscription already exists
    //if exists, unsubscribe (delete the subscription)
    //if not exists, subscribe (create the subscription)
    const {channelId} = req.params;

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id")
    }

    //User who is subscribing (from JWT)
    const subscriberId = req.user._id;

    if(subscriberId.toString() === channelId.toString()){
        throw new ApiError(400, "You cannot subscribe to yourself")
    }

    //check if subscription exists
    const existingSubscription = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    });

    if(existingSubscription){
        //unsubscribe
        await Subscription.deleteOne({_id: existingSubscription._id});
        return res.status(200).json(
            new ApiResponse(200, {}, "Unsubscribed successfully")
        )
    }else{
        //subscribe
        const subscription = await Subscription.create({
            subscriber: subscriberId,
            channel: channelId
        })

        return res.status(201).json(
            new ApiResponse(201, subscription, "Subscribed successfully")
        )
    }
})


//get all subscribers of a channel -> get who follows a channel.
const getUserChannelSubscribers = asyncHandler(async (req, res)=>{
    //get channel id from params
    //validate channel id
    //aggregation pipeline to get subscribers

    const { channelId } = req.params;
    
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id")
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails"
            }
        },
        {
            $unwind: "$subscriberDetails"
        },
        {
            $project: {
                _id: 1,
                subscriber: 1,
                createdAt: 1,
                "subscriberDetails.userName": 1,
                "subscriberDetails.fullName": 1,
                "subscriberDetails.email": 1,
                "subscriberDetails.avatar": 1,
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, subscribers,"Subscribers fetched successfully")
    )
})

//get all subscribed channels of a user -> get who a user follows
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id");
    }

    const subscribedChannels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelDetails"
            }
        },
        { $unwind: "$channelDetails" },
        {
            $project: {
                _id: 1,
                channel: 1,
                createdAt: 1,
                "channelDetails.userName": 1,
                "channelDetails.fullName": 1,
                "channelDetails.email": 1,
                "channelDetails.avatar": 1,
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, subscribedChannels, "Subscribed channels fetched successfully")
    );
});



export {
    toggleSubscription, 
    getUserChannelSubscribers,
    getSubscribedChannels
};