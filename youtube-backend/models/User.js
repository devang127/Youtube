const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    channelName:{type:String, required:true},
    email: { type: String, required: true, unique: true },
    phone:{type:Number, required:true},
    password: {type:String, required:true},
    logoUrl: {type:String, required:true},
    logoId: {type:String, required:true},
    subscribers: {type:Number, required:true},
    subscribedBy: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
    subscribedChannels: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
    refreshToken: { type: String },
    Timestamp: {type:Date, default:Date.now},
})

module.exports = mongoose.model('User', userSchema)