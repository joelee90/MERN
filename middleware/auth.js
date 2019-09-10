const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    //Get token from header
    const token = req.header('x-auth-token');

    //Check if not token
    if(!token) {
        return res.status(401).json({ msg: 'No token, authorization denied'});
    }

    //Verify toekn
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        //can use this in any of the routes(ex get users profile)
        req.user = decoded.user;
        next();
    } catch(err){
        res.status(401).json({ msg: 'Token is not valid'});
    }
};
