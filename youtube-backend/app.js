const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const userRoute = require('./routes/user')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

const connectDb = async() => {
    try{
        const res = await mongoose.connect(process.env.MONGODB_URL)
        console.log("mongodb Connected")
    }
    catch(err){
        console.log(err)
    }
}

connectDb()

app.use(bodyParser.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))
 

app.use('/user', userRoute)

module.exports = app;