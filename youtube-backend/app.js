const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/userRoutes');
const videoRoute = require('./routes/videoRoutes');


const connectDb = async() => {
    try {
        const res = await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB Connected");
    } catch(err) {
        console.log(err);
    }
};

connectDb();


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));


app.use('/user', userRoute);
app.use("/video", videoRoute);

module.exports = app;