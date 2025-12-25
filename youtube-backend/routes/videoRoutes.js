const express = require('express');
const Router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const videoController = require('../controllers/videoController');

// Get all videos
Router.get('/', videoController.getAllVideos);

// Upload video 
Router.post('/upload', checkAuth, videoController.uploadVideo);

// Update video 
Router.put('/:videoId', checkAuth, videoController.updateVideo);

// Delete video 
Router.delete('/:videoId', checkAuth, videoController.deleteVideo);

// Like video 
Router.put("/like/:videoId", checkAuth, videoController.likeVideo);

// Dislike video 
Router.put("/dislike/:videoId", checkAuth, videoController.disLikeVideo);

// Get video details
Router.get('/:videoId', videoController.getVideoDetails);


module.exports = Router;