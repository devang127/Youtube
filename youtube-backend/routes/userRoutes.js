const express = require('express');
const Router = express.Router();
const userController = require('../controllers/userController');
const checkAuth = require('../middleware/checkAuth');


Router.post('/signup', userController.signup);


Router.post('/login', userController.login);

Router.put('/subscribe/:userBId', checkAuth, userController.subscribedByUser);

module.exports = Router;