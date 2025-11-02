const cloudinary = require('cloudinary').v2;
const Video = require('../models/Video');
const Like = require('../models/Like')
const Dislike = require('../models/Dislike');
const mongoose = require('mongoose');
const ThumbnailService = require('../utils/thumbnailService');
require('dotenv').config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// const uploadVideo = async (req, res) => {
//     try {
//         const user = req.user;
        
//         const uploadVideo = await cloudinary.uploader.upload(req.files.video.tempFilePath, {resource_type: "video"});
//         // old thumbnail 
//         // const uploadThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath, {resource_type: "image"});


//         // new thumbnail
//         let thumbnailUrl, thumbnailId;

//         if (req.files && req.files.thumbnail) {
//             const uploadThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath,
//                 {
//                     resource_type: "image",
//                     folder: "youtube-clone/thumbnails"
//                 }
//             );
            
//             thumbnailUrl = uploadThumbnail.secure_url;
//             thumbnailId = uploadThumbnail.public_id;
//         } else {
//             console.log('Auto-generating thumbnail from video...');
//             const generatedThumbnail = await ThumbnailService.generateAndUpload(req.files.video.tempFilePath,2);
            
//             thumbnailUrl = generatedThumbnail.url;
//             thumbnailId = generatedThumbnail.publicId;
//         }

//         const newVideo = new Video({
//             _id: new mongoose.Types.ObjectId(),
//             title: req.body.title,
//             description: req.body.description,
//             user_id: user._id,
//             videoUrl: uploadVideo.secure_url,
//             videoId: uploadVideo.public_id,
//             thumbnailurl: uploadThumbnail.secure_url,
//             thumbnailId: uploadThumbnail.public_id,
//             category: req.body.category,
//             tags: req.body.tags.split(','),
//         });

//         const newUploadedVideoData = await newVideo.save();

//         res.status(200).json({
//             message: "Video uploaded successfully",
//             video: newUploadedVideoData
//         });

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({message: "Internal Server Error"});
//     }
// };

// Update video 

const uploadVideo = async (req, res) => {
    try {
        const user = req.user;
        const uploadVideo = await cloudinary.uploader.upload(
            req.files.video.tempFilePath, 
            { 
                resource_type: "video",
                folder: "youtube-clone/videos"
            }
        );

        let thumbnailUrl, thumbnailId;
        if (req.files && req.files.thumbnail) {
            const uploadThumbnail = await cloudinary.uploader.upload(
                req.files.thumbnail.tempFilePath,
                {
                    resource_type: "image",
                    folder: "youtube-clone/thumbnails",
                    transformation: [
                        { width: 1280, height: 720, crop: 'fill' }
                    ]
                }
            );
            thumbnailUrl = uploadThumbnail.secure_url;
            thumbnailId = uploadThumbnail.public_id;
        } else {
            thumbnailUrl = cloudinary.url(uploadVideo.public_id, {
                resource_type: 'video',
                format: 'jpg',
                transformation: [
                    { width: 1280, height: 720, crop: 'fill', gravity: 'center' },
                    { start_offset: '2' }
                ]
            });
            
            thumbnailId = `${uploadVideo.public_id}_thumb`;
        }

        const newVideo = new Video({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            description: req.body.description,
            user_id: user._id,
            videoUrl: uploadVideo.secure_url,
            videoId: uploadVideo.public_id,
            thumbnailurl: thumbnailUrl,
            thumbnailId: thumbnailId,
            category: req.body.category,
            tags: req.body.tags ? req.body.tags.split(',') : [],
        });

        await newVideo.save();

        res.status(200).json({
            message: "Video uploaded successfully",
            video: newVideo
        });

    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({
            message: err.message || "Internal Server Error"
        });
    }
};


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
        const userId = req.user._id; 
        const videoId = req.params.videoId;

        await Dislike.findOneAndDelete({
            user: userId,
            video: videoId
        });

        const newLike = new Like({
            user: userId,
            video: videoId
        });
        
        await newLike.save();

        res.status(201).json({
            message: "Video liked successfully"
        });

    } catch (err) {
      
        if (err.code === 11000) {
            return res.status(400).json({
                message: "You have already liked this video"
            });
        }
        
        console.log(err);
        res.status(500).json({
            message: "An error occurred while liking the video",
            error: err.message
        });
    }
};



const disLikeVideo = async (req, res) => {
    try {
        const userId = req.user._id;
        const videoId = req.params.videoId;

        await Like.findOneAndDelete({
            user: userId,
            video: videoId
        });

        const newDislike = new Dislike({
            user: userId,
            video: videoId
        });

        await newDislike.save();

        res.status(201).json({
            message: "Video disliked successfully"
        });

    } catch (err) {
        // duplicate error code is 11000
        if (err.code === 11000) {
            return res.status(400).json({
                message: "You have already disliked this video"
            });
        }

        console.log(err);
        res.status(500).json({
            message: "An error occurred while disliking the video",
            error: err.message
        });
    }
};


const getVideoDetails = async (req, res) => {
    try {
        const { videoId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ message: "Invalid video ID format" });
        }

        const video = await Video.findById(videoId);
        
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const likeCount = await Like.countDocuments({ video: videoId });

        const dislikeCount = await Dislike.countDocuments({ video: videoId });

        const videoDetails = video.toObject();
        

        videoDetails.likes = likeCount;
        videoDetails.dislikes = dislikeCount;
        
        res.status(200).json({
            message: "Video details fetched successfully",
            video: videoDetails
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = {
    uploadVideo,
    updateVideo,
    deleteVideo,
    likeVideo,
    disLikeVideo,
    getVideoDetails
};