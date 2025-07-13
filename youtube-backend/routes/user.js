const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
require('dotenv').config()
const jwt = require('jsonwebtoken');

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


Router.post('/signup',  async (req , res)=>{
   try{
        const users = await User.find({email: req.body.email})
        if(users.length>0){
            return res.status(500).json({message: "User already exists"})
        }

        const hashcode = await bcrypt.hash(req.body.password, 10)
        const upoadedImage = await cloudinary.uploader.upload(req.files.logo.tempFilePath)
        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            channelName: req.body.channelName,
            email: req.body.email,
            phone: req.body.phone,
            password: hashcode,
            logoUrl: upoadedImage.secure_url,
            logoId: upoadedImage.public_id,
            subscribers: 0,
            subscribedChannels: [],
        })

        const user = await newUser.save()
        res.status(201).json({
            newUser: user,
            
        })

   }catch(err){
       console.log(err)
       res.status(500).json({message: "Internal Server Error"})
   }
})



Router.post('/login', async (req, res) => {
    try {
        const users = await User.find({ email:req.body.email })
        if(users.length === 0) {
            return res.status(404).json({message: "Email is not registered"})
        }

        const isValid = await bcrypt.compare( req.body.password, users[0].password)
        if(!isValid) {
            return res.status(500).json({message: "Invalid Password"})
        }

        const token = jwt.sign({
            _id: users[0]._id,
            channelName: users[0].channelName,
            email: users[0].email,
            phone: users[0].phone,
            logoId: users[0].logoId,
        },'reynasage',{expiresIn: '24h'})
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
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message: "Internal Server Error"})
    }
})


module.exports = Router