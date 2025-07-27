const cloudinary = require('cloudinary').v2;
const Video = require('../models/Video');
const mongoose = require('mongoose');
require('dotenv').config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload video 
const uploadVideo = async (req, res) => {
    try {
        const user = req.user;
        
        const uploadVideo = await cloudinary.uploader.upload(req.files.video.tempFilePath, {resource_type: "video"});
        const uploadThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath, {resource_type: "image"});

        const newVideo = new Video({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            description: req.body.description,
            user_id: user._id,
            videoUrl: uploadVideo.secure_url,
            videoId: uploadVideo.public_id,
            thumbnailurl: uploadThumbnail.secure_url,
            thumbnailId: uploadThumbnail.public_id,
            category: req.body.category,
            tags: req.body.tags.split(','),
        });

        const newUploadedVideoData = await newVideo.save();

        res.status(200).json({
            message: "Video uploaded successfully",
            video: newUploadedVideoData
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};

// Update video 
const updateVideo = async (req, res) => {
    try {
   
        const verifyUser = req.user;
        const video = await Video.findById(req.params.videoId);
        
        if (!video) {
            return res.status(404).json({message: "Video not found"});
        }
        
        if (video.user_id != verifyUser._id) {
            return res.status(403).json({message: "You have no permission"});
        }

        console.log("verified");
        
        if (req.files && req.files.thumbnail) {
            await cloudinary.uploader.destroy(video.thumbnailId);
            const updateThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath);
            
            const updatedData = {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                tags: req.body.tags.split(','),
                thumbnailurl: updateThumbnail.secure_url,
                thumbnailId: updateThumbnail.public_id,
            };
            
            const updatedVideoDetail = await Video.findByIdAndUpdate(req.params.videoId, updatedData, {new: true});
            res.status(200).json({
                updatedVideo: updatedVideoDetail
            });
        } else {
            const updatedData = {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                tags: req.body.tags.split(','),
            };
            
            const updatedVideoDetail = await Video.findByIdAndUpdate(req.params.videoId, updatedData, {new: true});
            res.status(200).json({
                updatedVideo: updatedVideoDetail
            });
        }
    } catch (err) {
        console.log(err, "catch error");
        res.status(500).json({
            error: err
        });
    }
};

// Delete video 
const deleteVideo = async (req, res) => {
    try {
     
        const verifyUser = req.user;
        console.log(verifyUser);
        
        const video = await Video.findById(req.params.videoId);
        
        if (!video) {
            return res.status(404).json({message: "Video not found"});
        }
        
        if (video.user_id != verifyUser._id) {
            return res.status(403).json({
                message: "You have no permission"
            });
        }

        await cloudinary.uploader.destroy(video.videoId, {resource_type: "video"});
        await cloudinary.uploader.destroy(video.thumbnailId);
        
        const deletedRes = await Video.findByIdAndDelete(req.params.videoId);
        res.status(200).json({
            deletedRes: deletedRes
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
};


const likeVideo = async (req, res) => {
    try {
  
        const verifyUser = req.user;
        console.log(verifyUser);

        const video = await Video.findById(req.params.videoId)
        console.log(video)
        
        if(video.likedBy.includes(verifyUser._id)) {
            return res.status(400).json({
                message: "You have already liked this video"
            });
        }

        video.likes += 1;
        video.likedBy.push(verifyUser._id);
        await video.save();

        res.status(200).json({
            message: "Video liked successfully",
            user: verifyUser
        });

        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
};



const disLikeVideo = async (req, res) => {
    try {
  
        const verifyUser = req.user;
        console.log(verifyUser);

        const video = await Video.findById(req.params.videoId)
        console.log(video)
        
        if(video.dislikedBy.includes(verifyUser._id)) {
            return res.status(400).json({
                message: "You have already disliked this video"
            });
        }
        if(video.likedBy.includes(verifyUser._id)) {
            video.likes -= 1;
            video.likedBy = video.likedBy.filter(userId => userId.toString() !== verifyUser._id.toString());
        }
        video.dislike += 1;
        video.dislikedBy.push(verifyUser._id);
        await video.save();

        res.status(200).json({
            message: "Video disliked successfully",
            user: verifyUser
        });

        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
};




module.exports = {
    uploadVideo,
    updateVideo,
    deleteVideo,
    likeVideo,
    disLikeVideo
};