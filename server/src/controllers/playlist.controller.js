import { asyncHandler } from "../utils/asyncHandler.js"
import {Playlist} from "../models/playlist.model.js";
import {Video} from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { isValidObjectId } from "mongoose";
import mongoose from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
    //get user id from JWT
    //get title, description from body
    //validate title and description
    //create playlist
    //return response

    const { name, description } = req.body;

    if(!name || name.trim() === ""){
        throw new ApiError(400, "Playlist name is required")
    }
    if(!description || description.trim() === ""){
        throw new ApiError(400, "Playlist description is required")
    }

    const owner = req.user._id;

    const playlist = await Playlist.create({
        name,
        description,
        owner,
        videos: []
    })

    if(!playlist){
        throw new ApiError(500, "Something went wrong while creating playlist")
    }

    return res.status(201).json(
        new ApiResponse(201, playlist, "Playlist created successfully")
    )
})


// get all playlists of a user
const getUserPlaylists = asyncHandler(async (req, res)=>{
    const { userId } = req.params;

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id")
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {   
                owner:  new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline:[
                    {
                        $project: {
                            userName: 1,
                            fullName: 1,
                            avatar: 1
                        } 

                    }
                ]
            }
        },
        {
            $addFields:{
                owner: {
                    $first: "$owner",
                },
                totalVideos: { 
                        $size: "$videos"
                },
                totalViews: {
                        $sum: "$videos.views"
                }
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                owner: 1,
                videos:{
                    _id: 1,
                    title: 1,
                    thumbnail: 1,
                    duration: 1,
                    views: 1,
                },
                totalVideos: 1,
                totalViews: 1,
                createdAt: 1,
                updatedAt: 1 
            },
              
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, playlists, "Playlists fetched successfully")
    )
})

//get playlist by id
const getPlaylistById = asyncHandler( async (req, res)=>{
    const { playlistId } = req.params;

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup:{
                from: 'videos',
                localField: 'videos',
                foreignField: '_id',
                as: 'videos',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project:{
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
                            owner: { $first: "$owner" }
                        },
                    },
                    {
                        $project: {
                            title:1, 
                            description:1,
                            thumbnail:1,
                            videoFile: 1,
                            duration:1,
                            views:1,
                            owner:1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline:[  
                    {
                        $project: {
                            userName: 1,
                            fullName: 1,
                            avatar: 1
                        }       
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" },
                totalVideos: { $size: "$videos" },
                totalViews: { $sum: "$videos.views" }
            }
        },
    ])

    if(!playlist || playlist.length === 0){
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).json(
        new ApiResponse(200, playlist[0], "Playlist fetched successfully")
    )
})



//add video to playlist
const addVideoToPlaylist = asyncHandler(async (req, res)=>{
    //get playlist id from params
    //validate playlist id
    //get video id from body
    //validate video id
    //find video by id
    //find playlist by id
    //check if playlist exists
    //check if video already exists in playlist
    //if exists, return error
    //if not exists, add video to playlist
    //save playlist
    //return response

    const { playlistId, videoId} = req.params;

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }

    if( !isValidObjectId(videoId) ){
        throw new ApiError(400, "Invalid video id")
    }

    const playlist = await Playlist.findById(playlistId);

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to add videos to this playlist")
    }

    //check if video already exists in playlist
    if(playlist.videos.some(video => video.toString() === videoId.toString())){
        throw new ApiError(400, "Video already exists in playlist")
    }

    //save
    playlist.videos.push(videoId);
    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
    )
})

//remove a video from playlist
const removeVideoFromPlaylist = asyncHandler( async (req, res)=>{
    
    const { playlistId, videoId} = req.params;

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }

    if( !isValidObjectId(videoId) ){
        throw new ApiError(400, "Invalid video id")
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    const videoExists = playlist.videos.some(video => video.toString() === videoId.toString());
    if(!videoExists){
        throw new ApiError(404, "Video not found in playlist")
    }

    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to remove videos from this playlist")
    }

    playlist.videos = playlist.videos.filter((video)=>video.toString() !== videoId.toString())

    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video removed from playlist successfully")
    )
})

//delete a playlist
const deletePlaylist = asyncHandler( async(req, res)=>{
    const { playlistId } = req.params;

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to delete this playlist")
    }

    await Playlist.deleteOne({_id: playlistId});

    return res.status(200).json(
        new ApiResponse(200, {}, "Playlist deleted successfully")
    )
})

//update a playlist
const updatePlaylist = asyncHandler( async (req, res)=>{
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }

    if((!name || !name.trim()) && (!description ||!description.trim())){
        throw new ApiError(400, "Playlist name and description are required")
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to update this playlist")
    }

    if(name && name.trim()){
        playlist.name = name.trim();
    }

    if(description && description.trim()){
        playlist.description = description.trim();
    }

    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist updated successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}