const express = require('express');
const Router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const commentController = require('../controllers/commentController');

Router.get('/video/:videoId', commentController.getVideoComments);


Router.post('/video/:videoId', checkAuth, commentController.addComment);


Router.put('/:commentId', checkAuth, commentController.updateComment);


Router.delete('/:commentId', checkAuth, commentController.deleteComment);


Router.put('/:commentId/like', checkAuth, commentController.toggleCommentLike);

module.exports = Router;