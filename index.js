// IMPORTS

/* cors - Cross-Origin Resource Sharing
 * https://www.youtube.com/watch?v=4KHiSt0oLJ0
 * for allowing to request data from other domains (browser denies it by default)
 */

const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const corseOptions = require('./config/cors.js');
const connectDB = require('./config/database.js');
const credentials = require('./middleware/credentials.js');
const errorHandlerMiddleware = require('./middleware/errorHandler.js');
require('dotenv').config();
const path = require('path');

// MIDDLEWARE
const app = express();

app.use(cors()); // for allowing to request data from other domains
app.use(express.json()); // parses json
app.use(cookieParser()); // parses cookies
app.use(express.urlencoded({ extended: false })); // parses form data
app.use('/static', express.static(path.join(__dirname, 'public'))); // serves static files
app.use(credentials);
app.use(errorHandlerMiddleware);

connectDB();

// routes
app.use('/api/auth', require('./routes/api/auth'));

app.all('*', (req, res) => {
  res.status(404).send('Not Found');
});

const PORT = 3500;

// open app when database is connected
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log('Listening...');
  });
});