import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";



//get all video controller 
//learn after completing the application(only this controller)

const getAllVideos = asyncHandler (async (req, res)=>{
    // Extract query params from request
    const { page = 1, limit = 10, query, sortBy= "createdAt", sortType = "desc", userId } = req.query;

    //Create a base filter (match object for MongoDB)
    const match = {};

    //If "query" is provided, filter videos by title (case-insensitive regex search)
    if(query){
        match.title = { $regex: query, $options: "i"}
    }

    //If userId is valid, filter videos belonging to that specific user
    if(userId && isValidObjectId(userId)){
        match.owner = new mongoose.Types.ObjectId(userId);
    }

    //Build an aggregation pipeline
    const videoAggregate = Video.aggregate([
        {
            $match: match
        },
        {
            $sort: {
                [sortBy]: sortType ===  'asc' ? 1 : -1
            }
        }
    ])

    //paginate options
    const options = {
        page: parseInt(page, 10),    //Number(page) -->>convert string to number
        limit: parseInt(limit, 10)   //Number(limit)
    }

    //run aggregation with pagination plugin
    const videos = await Video.aggregatePaginate(videoAggregate, options);

    //return response
    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    )
})

//publish video
const publishAVideo = asyncHandler(async (req, res)=>{
    const {title, description} = req.body;

    if(!title || !description){
        throw new ApiError(400, "Title and description are required")
    }

    const videoFileLocalPath = req.files?.videoFile?.[0].path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if(!videoFileLocalPath || !thumbnailLocalPath){
        throw new ApiError(400,"Video file and thumbnail are required")
    }

    //upload to cloudinary
    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!videoFile?.url || !thumbnail?.url ){
        throw new ApiError(500, "Error uploading file to cloudinary")
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration || 0,
        owner: req.user._id
    });

    // const publishedVideo = await Video.findById(video._id);

    // if(!publishedVideo){
    //     throw new ApiError(500, "Video is not published while publishing")
    // }

    return res.status(201)
    .json(
        new ApiResponse(
            201, video, "Video published successfully"
        )
    )
})


//get a video by id
const getVideoById = asyncHandler(async (req, res)=>{
    const { videoId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "Invalid videoId");
    }
    // if(!isValidObjectId(videoId)){   //alternative of above code
    //     throw new ApiError(400, "Invalid videoId");
    // }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(400, "Video not found")
    }

    //increment views 
    video.views += 1;
    await video.save();

    return res.status(200)
    .json(
        new ApiResponse(200, video, "Video fetched successfully")
    )
})


//update video
const updateVideo = (async (req, res)=>{
    //get video id  from req.params
    //get title and description
    //check id: valid or not using mongoose method
    //find video
    //check ownership(owner) 
    //initialize update data
    //update text field
    //get thumbnail(if want to update)
    //check if any field is updated
    //perform database update
    //return response
    
    const { videoId } = req.params;
    const { title, description } = req.body;

    //check videoId
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid videoId")
    }

    //find video
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    //check owner: only owner can update
    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not allowed to update this video")
    }

    //initialize update obj
    const updateData = {};

    // Update title & description if provided
    if(title){
        updateData.title = title
    }
    if (description) {
        updateData.description = description
    }

    //update thumbnail if provided
    const thumbnailLocalPath = req.file?.path;
    if(thumbnailLocalPath){
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        if(thumbnail?.url){
            updateData.thumbnail = thumbnail.url;
        }
    }

    //// Ensure at least one field is provided
    if(Object.keys(updateData).length === 0 ){
        throw new ApiError(400, "No fields provided to update")
    }

    //updte the video
    const updatedVideo = await Video.findByIdAndUpdate(videoId, updateData, {new: true});
   
    //alternative
    // const updatedVideo = await Video.findByIdAndUpdate(
    // videoId,
    // { $set: updateData },
    // { new: true }
    // );

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    )

})


//delete video
const deleteVideo = asyncHandler (async (req, res)=>{
    //get videoId from req.params
    //check objectId
    //fetch video
    //check ownership
    //delete video

    const { videoId } = req.params;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid VideoId")
    }

    //find/fetch video
    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404, "video is not found")
    }

    //check ownership(only owner can delete)
    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(400, "You are not allowed to delete this video")
    }

    //delete video
    await Video.findByIdAndDelete(videoId);

    //return response
    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )
})


//Toggle publish status
const togglePublishStatus = asyncHandler(async (req, res)=>{
    const {videoId} = req.params;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "VideoId is not valid")
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404, "Video is not found")
    }

    //check ownership
    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not allowed to change publish status")
    }

    //toggle 
    video.isPublished = !video.isPublished;

    await video.save(); //save at database and return updated value also
    // video = await video.save();   alternative (also redundant)

    //return response
    return res.status(200).json(
        new ApiResponse(200, video, "Video publish status updated")
    )
})


export {
    getAllVideos,
    publishAVideo, 
    getVideoById, 
    updateVideo, 
    deleteVideo, 
    togglePublishStatus
}