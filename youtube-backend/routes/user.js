const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const mongoose = require('mongoose');



Router.post('/signup',  async (req , res)=>{
   try{
        const hashcode = await bcrypt.hash(req.body.password, 10)
        console.log(hashcode)

   }catch(err){
       console.log(err)
       res.status(500).json({message: "Internal Server Error"})
   }
})


module.exports = Router