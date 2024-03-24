import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query


  // find video in database 
  const video = await Video.findById(videoId)
  if (!video) {
      throw new ApiError(404, "video not found");
  }

  // match and finds all the comments
  const aggregateComments = await Comment.aggregate([
      {
          $match:{
             video: videoId,
          }
      }
  ])

 console.log(aggregateComments); //this is giving empty array find the reason??

  const result= await Comment.aggregatePaginate(aggregateComments, {
    page,
    limit
  })

  res.status(200).json(
    new ApiResponse(200, result, "result")
  )

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    //get comment from req.body and get video using videoId in params
    //left join the video using videoId
    //from req.user add the owner 
    //now save using .create()

    const {content} = req.body
    const {videoId} = req.params //if you do it like const videoId = req.params then it will give you validation error because When you extract parameters from req.params, it gives you an object containing the route parameters. Therefore, req.params is an object, not a specific value.

    //To fix this, you need to extract the videoId from req.params correctly. Assuming the videoId parameter is named "videoId" in your route, you would access it like this: req.params.videoId.

    if(!content){
        throw new ApiError(400, "comment can't be empty")
    }
    if(!videoId){
        throw new ApiError(400, "no video Id found")
    }

    const comment = await Comment.create({
        content,
        video:videoId,
        owner: req.user._id
    })

    if(!comment){
        throw new ApiError(500, "coudn't add comment")
    }

    res.status(200).json(
        new ApiResponse(200, comment, "commented on video successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params

    const {content} = req.body
    
    if(!content){
        throw new ApiError(400, "comment can't be empty")
    }
    
    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                content:content
            },
        },{new: true}
    )

    if(!comment){
        throw new ApiError(500, "coudn't update comment")
    }

    res.status(200).json(
        new ApiResponse(200, comment, "comment updated successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const contentId = req.params
    
    const comment = await Comment.findByIdAndDelete(contentId);
    if(!comment){
        throw new ApiError(500, "coudn't delete comment")
    }

    res.status(200).json(
        new ApiResponse(200, comment, "comment deleted successfully")
    )
    
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}