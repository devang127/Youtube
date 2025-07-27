const bcrypt = require('bcrypt');
const User = require('../models/User');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
require('dotenv').config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const signup = async (req, res) => {
    try {
        const users = await User.find({email: req.body.email});
        if (users.length > 0) {
            return res.status(500).json({message: "User already exists"});
        }

        const hashcode = await bcrypt.hash(req.body.password, 10);
        const uploadedImage = await cloudinary.uploader.upload(req.files.logo.tempFilePath);
        
        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            channelName: req.body.channelName,
            email: req.body.email,
            phone: req.body.phone,
            password: hashcode,
            logoUrl: uploadedImage.secure_url,
            logoId: uploadedImage.public_id,
            subscribers: 0,
            subscribedChannels: [],
        });

        const user = await newUser.save();
        res.status(201).json({
            newUser: user,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};


const login = async (req, res) => {
    try {
        const users = await User.find({ email: req.body.email });
        if (users.length === 0) {
            return res.status(404).json({message: "Email or password is incorrect"});
        }

        const isValid = await bcrypt.compare(req.body.password, users[0].password);
        if (!isValid) {
            return res.status(500).json({message: "Email or password is incorrect"});
        }

        const token = jwt.sign({
            _id: users[0]._id,
            channelName: users[0].channelName,
            email: users[0].email,
            phone: users[0].phone,
            logoId: users[0].logoId,
        }, 'reynasage', {expiresIn: '24h'});

        res.status(200).json({
            message: "Login Successful",
            token: token,
            user: {
                _id: users[0]._id,
                channelName: users[0].channelName,
                email: users[0].email,
                phone: users[0].phone,
                logoUrl: users[0].logoUrl,
                subscribers: users[0].subscribers,
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};


const subscribedByUser = async (req, res) => {
    try {
        const verifyUser = req.user;

        const userB = await User.findById(req.params.userBId);
        console.log(userB);
        if(userB.subscribedBy.includes(verifyUser._id)) {
            console.log("yesh chala");
            return res.status(400).json({message: "You are already subscribed to this channel"});
        }

        userB.subscribers += 1;
        userB.subscribedBy.push(verifyUser._id);
        await userB.save();
        const userAFullInformaion = await User.findById(verifyUser._id);
        userAFullInformaion.subscribedChannels.push(userB._id);
        await userAFullInformaion.save();
        console.log(userAFullInformaion, "userAFullInformaion");

        res.status(200).json({
            message: "Subscribed successfully",
            subscribedTo: userB.channelName,
            subscribersCount: userB.subscribers
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};

module.exports = {
    signup,
    login,
    subscribedByUser
};