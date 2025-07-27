const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'reynasage');
        
      
        req.user = decoded;
        
        next(); 
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed',
            error: error.message
        });
    }
};

module.exports = checkAuth;