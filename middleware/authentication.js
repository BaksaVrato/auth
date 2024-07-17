const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader?.startsWith('Bearer ')) {

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        req.user = {};
        return next();
      }

      const user = await User
        .findOne({ _id: decoded.user_id }
        .select({ password: 0, refresh_token: 0 })) // exclude password and refresh token
        .exec();
      
      if (!user) {
        req.user = {};
        return next();
      } 
      
      req.user = user.toObject({ getters: true }); // convert mongoose object to javascript object
      next();

    });
  };
};

module.exports = authentication;