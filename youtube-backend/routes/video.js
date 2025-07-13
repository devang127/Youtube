const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const Router = express.Router();
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const Video = require('../models/Video');
require('dotenv').config();
const mongoose = require('mongoose');



cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

Router.post('/upload', checkAuth, async (req, res) => {
    try{
        const token = req.headers.authorization.split(" ")[1] 
        const user = await jwt.verify(token, 'reynasage');
        // console.log(user)
        // console.log(req.body)
        // console.log(req.files.video)
        // console.log(req.files.thumbnail)
        const uploadVideo = await cloudinary.uploader.upload(req.files.video.tempFilePath,{resource_type: "video"})
        const uploadThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath,{resource_type: "image"})

        const newVideo = new Video({
            _id: new mongoose.Types.ObjectId,
            title: req.body.title,
            description: req.body.description,
            user_id: user._id,
            videoUrl: uploadVideo.secure_url,
            videoId: uploadVideo.public_id,
            thumbnailurl: uploadThumbnail.secure_url,
            thumbnailId: uploadThumbnail.public_id,
            category: req.body.category,
            tags: req.body.tags.split(','),
        })

        const newUploadedVideoData = await newVideo.save();

        res.status(200).json({
            message: "Video uploaded successfully",
            video: newUploadedVideoData
        });



    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
})


Router.put('/:videoId', checkAuth, async (req, res) =>{
    try{
        const verifyUser = await jwt.verify(req.headers.authorization.split(" ")[1], "reynasage")
        const video =  await  Video.findById(req.params.videoId)
        if(video.user_id == verifyUser._id)
        {
            console.log("verified")
            if(req.files){
                await cloudinary.uploader.destroy(video.thumbnailId)
                const updateThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath)
                const updatedData = {
                    title: req.body.title,
                    description: req.body.description,
                    category: req.body.category,
                    tags: req.body.tags.split(','),
                    thumbnailurl: updateThumbnail.secure_url,
                    thumbnailId: updateThumbnail.public_id,
                }
                const updatedVideoDetail = await Video.findByIdAndUpdate(req.params.videoId,updatedData,{new:true})
                res.status(200).json({
                    updatedVideo:updatedVideoDetail
                })
            }else{
                const updatedData = {
                    title: req.body.title,
                    description: req.body.description,
                    category: req.body.category,
                    tags: req.body.tags.split(','),
                }
                const updatedVideoDetail = await Video.findByIdAndUpdate(req.params.videoId,updatedData,{new:true})
                res.status(200).json({
                    updatedVideo:updatedVideoDetail
                })
                console.log(error)
            }
        }else{
            res.status(403).json({message: "You have no permission"});
        }
    }
    catch(err){
        console.log(err, "catch error");
        res.status(500).json({
            error:err
        })
    }
})


Router.delete('/:videoId', checkAuth, async(req, res) =>{
    try{
        const verifyUser = await jwt.verify(req.headers.authorization.split(" ")[1], "reynasage")
        console.log(verifyUser);
        const video = await Video.findById(req.params.videoId)
        if(video.user_id == verifyUser._id){
            await cloudinary.uploader.destroy(video.videoId,{resource_type:"video"})
            await cloudinary.uploader.destroy(video.thumbnailId)
            const deletedRes = await Video.findByIdAndDelete(req.params.videoId)
            res.status(200).json({
                deletedRes: deletedRes
            })
        }else{
            return res.status(500).json({
                error:err
            })
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})


Router.put("/like/:videoId", checkAuth, async(req, res) =>{
    try{
        const verifyUser = await jwt.verify(req.headers.authorization.split(" ")[1], "reynasage")
        console.log(verifyUser)
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            error:err
        })
    }
})

module.exports = Router;