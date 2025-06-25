const mongoose = require('mongoose')
const { subscribe } = require('../app')

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    channelName:{type:String, required:true},
    email:{type:String, required:true},
    phone:{type:Number, required:true},
    password: {type:String, required:true},
    logoUrl: {type:String, required:true},
    logoId: {type:String, required:true},
    subscribers: {type:Number, required:true},
    subscribedChannels: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
    Timestamp: {type:Date, default:Date.now},
})

module.exports = mongoose.model('User', userSchema)