
const allowedOrigins = require('./allowedOrigins'); // allowed origins for CORS

// Function that checks if the origin is allowed by CORS.
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

module.exports = {
  corsOptions
};