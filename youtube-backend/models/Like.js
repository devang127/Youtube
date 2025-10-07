const mongoose = require('mongoose');
const { Schema } = mongoose;

const likeSchema = new Schema({
    video: { 
        type: Schema.Types.ObjectId, 
        ref: 'Video',
        required: true 
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    }
}, {
    timestamps: true 
});


likeSchema.index({ user: 1, video: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);