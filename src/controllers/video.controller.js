import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    // get user details from frontend
    // validation - not empty
    // check for videoFile, check for thumbnail
    // upload them to cloudinary, and check
    // create video object - create entry in db
    // check for user creation
    // return res

    if(
        [title, description].some((feild)=>{ feild?.trim() === ""})
        ){
        throw new ApiError(400, "title and description are required")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path;

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if(!(videoLocalPath || thumbnailLocalPath)){
        throw new ApiError(400,"no videoLocalPath or thumbnailLocalPath found");
    }

    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnaill = await uploadOnCloudinary(thumbnailLocalPath);

    if(!(video || thumbnaill)){
        throw new ApiError(500, "coundn't upload video or thumbnail on cloudinary")
    }
    if(!req.user._id){
        throw new ApiError(400, "no user found as logged in");
    }
    const videoObj = await Video.create({
        videoFile :video.url,
        thumbnail: thumbnaill.url,
        title,
        description,
        duration: video.duration,
        views:344,
        owner: req.user._id
    })

    res.status(200).json(
        new ApiResponse(200, videoObj, "video uploaded successfully")
    )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!(videoId?.trim())){
        throw new ApiError(400, "video not found");
    }

    const video = await Video.findOne({ _id: videoId });

    if(!video){
        throw new ApiError(400, "video not found");
    }
    // console.log(video);
    res.status(200).json(
        new ApiResponse(200, video, "Here is video's data")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if(!videoId){
        throw new ApiError(400, "No file id got to update");
    }
    const thumbnailLocalPath = req.file?.path
    
    if(!thumbnailLocalPath?.trim()){
        throw new ApiError(400, "no thumbnail photo found to update")
    }

    const thumbnaill = await uploadOnCloudinary(thumbnailLocalPath);

    if(!thumbnaill){
        throw new ApiError(500, "coudn't upload")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                thumbnail: thumbnaill.url
           }
        },{new : true}
    )

    res.status(200).json(
        new ApiResponse(200, video, "updated the thumbnail")
    )

    

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const video = await Video.findByIdAndDelete(videoId);

    console.log(video);
    res.status(200).json(
        new ApiResponse(200, video, "deleted the video")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId){
        throw new ApiError(400, "no video url found");
    }

    let video= await Video.findOne({_id:videoId})
    const isPublished = !video.isPublished
    video = await Video.updateOne({isPublished:isPublished})

    res.status(200).json(
        new ApiResponse(200, video, "Publis toggle successfull")
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