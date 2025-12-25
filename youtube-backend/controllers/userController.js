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


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -refreshToken');
        res.status(200).json({
            message: "Users fetched successfully",
            count: users.length,
            users: users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const signup = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
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
            message: "User created successfully",
            user: {
                _id: user._id,
                channelName: user.channelName,
                email: user.email,
            },
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// The updated login function
const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: "Email or password is incorrect" });
        }

        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Email or password is incorrect" });
        }
        
        const accessToken = jwt.sign(
            { _id: user._id, channelName: user.channelName, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '24h' }
        );

     
        const refreshToken = jwt.sign(
            { _id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

  
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true, 
            sameSite: 'None', 
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.status(200).json({
            message: "Login Successful",
            accessToken: accessToken,
            user: {
                _id: user._id,
                channelName: user.channelName,
                email: user.email,
                phone: user.phone,
                logoUrl: user.logoUrl,
                subscribers: user.subscribers,
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const refreshToken = async (req, res) => {

    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(401).json({ message: "Unauthorized: No refresh token" });
    }
    
    const refreshToken = cookies.jwt;


    const user = await User.findOne({ refreshToken: refreshToken });
    if (!user) {
        return res.status(403).json({ message: "Forbidden: Invalid refresh token" });
    }
    
 
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || user._id.toString() !== decoded._id) {
            return res.status(403).json({ message: "Forbidden: Token verification failed" });
        }

        const accessToken = jwt.sign(
            { _id: user._id, channelName: user.channelName, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        res.json({ accessToken });
    });
};


const logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204); 
    }

    const refreshToken = cookies.jwt;
    const user = await User.findOne({ refreshToken: refreshToken });
    if (user) {
        user.refreshToken = null;
        await user.save();
    }
    
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.status(200).json({ message: "Logout successful" });
};

const subscribedByUser = async (req, res) => {
    try {
        const verifyUser = req.user;

        const userB = await User.findById(req.params.userBId);
        console.log(userB);
        if(userB.subscribedBy.includes(verifyUser._id)) {
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

// just check the user
const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;

   
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }


        const user = await User.findById(userId).select('-password -refreshToken');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

    
        res.status(200).json({ user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    getAllUsers,
    signup,
    login,
    refreshToken,
    logout,
    subscribedByUser,
    getUserProfile
};