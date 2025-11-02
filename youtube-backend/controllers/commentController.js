
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
        const comments = await Comment.find({ video: videoId }).populate('user', 'channelName logoUrl').sort({ createdAt: 'asc' });
        const commentMap = {};
        const nestedComments = [];
        comments.forEach(comment => {
            const commentObj = comment.toObject();
            commentObj.replies = [];
            const idString = commentObj._id.toString();
            commentMap[idString] = commentObj;
        });
        comments.forEach(comment => {
            const commentId = comment._id.toString();
            const commentObj = commentMap[commentId];
            if (comment.parentComment) {
                const parentId = comment.parentComment.toString();
                const parent = commentMap[parentId];
                
                if (parent) {
                    parent.replies.push(commentObj);
                } else {
                    console.log("Parent not found");
                }
            } else {
                console.log("This is a top cmt");
                nestedComments.push(commentObj);
            }
        });

        console.log(" nested cmt", JSON.stringify(nestedComments, null, 2));
        res.status(200).json(nestedComments);

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Error fetching comments", error: err.message });
    }
};

const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;
        if (!content || content.trim() === '') {
            return res.status(400).json({ message: "Comment msg cannot be blank" });
        }
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }

        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You can only edit your own comments." });
        }
        comment.content = content.trim();
        await comment.save();
        const updatedComment = await comment.populate('user', 'channelName logoUrl');

        res.status(200).json({
            message: "Comment updated successfully.",
            comment: updatedComment
        });

    } catch (err) {
        res.status(500).json({ message: "Error updating comment", error: err.message });
    }
};

const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);


    if (comment.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: "You can only delete your own comments." });
    }


    // comment.content = "[deleted]";
    // comment.user = comment.user;
    // comment.user = null;
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully." });

};


// like cmt is pending

module.exports = {
    addComment,
    getVideoComments,
    deleteComment,
    updateComment
};