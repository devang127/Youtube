const express = require('express');
const Router = express.Router();
const userController = require('../controllers/userController');
const checkAuth = require('../middleware/checkAuth');


Router.post('/signup', userController.signup);


Router.post('/login', userController.login);

Router.get('/refresh', userController.refreshToken); 
Router.post('/logout', userController.logout); 

Router.put('/subscribe/:userBId', checkAuth, userController.subscribedByUser);

Router.get('/:userId', userController.getUserProfile); 

module.exports = Router;