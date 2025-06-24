const express = require('express');
const Router = express.Router();

Router.post('/signup', (req , res)=>{
    res.status(200).json({
        msg: 'signup'
    })
})


module.exports = Router