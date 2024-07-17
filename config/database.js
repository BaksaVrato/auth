const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(process.env.DATABASE_URI, { // takes from .env file
      useNewUrlParser: true,
      useUnifiedTopology: true
    }); 
    console.log('MongoDB connected');
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect;