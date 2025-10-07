const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({

    video: { 
        type: Schema.Types.ObjectId, 
        ref: 'Video',
        required: true,
        index: true 
    },

    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },

    content: {
        type: String,
        required: true,
        trim: true
    },

    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },

    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true 
});

module.exports = mongoose.model('Comment', commentSchema);