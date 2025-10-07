
const Comment = require('../models/Comment');
require('dotenv').config();

const addComment = async (req, res) => {
    const { videoId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.user._id;

    const newComment = new Comment({
        video: videoId,
        user: userId,
        content: content,
        parentComment: parentCommentId || null 
    });

    await newComment.save();

    const populatedComment = await newComment.populate('user', 'channelName logoUrl');

    res.status(201).json(populatedComment);
};


const getVideoComments = async (req, res) => {
    try {
        const { videoId } = req.params;


        const comments = await Comment.find({ video: videoId })
            .populate('user', 'channelName logoUrl')
            .sort({ createdAt: 'asc' });  

        const commentMap = {};
        const nestedComments = [];

     
        comments.forEach(comment => {

            comment = comment.toObject();
            comment.replies = [];
            commentMap[comment._id] = comment;
        });
 
        comments.forEach(comment => {
            if (comment.parentComment) {
                const parent = commentMap[comment.parentComment];
                if (parent) {
                    parent.replies.push(commentMap[comment._id]);
                }
            } else {
   
                nestedComments.push(commentMap[comment._id]);
            }
        });

        res.status(200).json(nestedComments);

    } catch (err) {
        res.status(500).json({ message: "Error fetching comments", error: err.message });
    }
};


const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);


    if (comment.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: "You can only delete your own comments." });
    }


    comment.content = "[deleted]";
    comment.user = null; 
    await comment.save();

    res.status(200).json({ message: "Comment deleted successfully." });
};


module.exports = {
    addComment,
    getVideoComments,
    deleteComment,
};