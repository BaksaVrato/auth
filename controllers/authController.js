// accept requests from client about registration and login

const jwt = require('jsonwebtoken');  // for creating tokens
const bcrypt = require('bcrypt');   // for hashing passwords

// models
const User = require('../models/User');


// controllers
const register = async (req, res) => {
  const { username, email, first_name, last_name, password, password_confirm } = req.body;

  if (!username || !email || !first_name || !last_name || !password || !password_confirm) {
    return res.status(422).json({ message: 'All fields are required' });
  };

  if (password !== password_confirm) {
    return res.status(422).json({ message: 'Passwords do not match' });
  };

  const existingUser = await User.findOne({ email }).exec();;

  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  };

  try {
    hashedPassword = await bcrypt.hash(password, 10);
    
    await User.create({
      username,
      email,
      first_name,
      last_name,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    res.status(500).json({ message: "Not able to register user" });
  };
};

const login = async (req, res) => {
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ message: 'All fields are required' });
  };

  const user = await User.findOne({ email }).exec();;

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  };

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  };

  // .env - more info + tokens
  const accessToken = jwt.sign(
    { user_id: user._id }, 
    process.env.ACCESS_TOKEN_SECRET, 
    { expiresIn: '1800s' }
  );

  const refreshToken = jwt.sign(
    { user_id: user._id }, 
    process.env.REFRESH_TOKEN_SECRET, 
    { expiresIn: '1d' }
  );

  user.refresh_token = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    //sameSite: 'None',
    //secure: true
  });

  res.json({ accessToken });

};

const logout = async (req, res) => {
  
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const user = await User.findOne({ refresh_token: refreshToken }).exec();
  if (!user) {
    res.clearCookie('refreshToken',{
      httpOnly: true,
      //sameSite: 'None',
      //secure: true
    });
    return res.sendStatus(204);
  };
  
  user.refresh_token = null;
  await user.save();
  
  res.clearCookie('refreshToken');
  res.sendStatus(204);

};

const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) return res.sendStatus(401);

  const user = await User.findOne({ refresh_token: refreshToken }).exec();
  
  if (!user) return res.sendStatus(403);
  
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {

    if (err || user._id.toString() !== decoded.user_id) {
      return res.sendStatus(403);
    };

    const accessToken = jwt.sign(
      { user_id: user._id }, 
      process.env.ACCESS_TOKEN_SECRET, 
      { expiresIn: '1800s' }
    );

    res.json({ accessToken });
  });

};

// not working :C
const user = async (req, res) => {
  
  const user = await User.findOne({ refresh_token: refreshToken }).exec();
  console.log(req);

  console.log(user);

  return res.status(200).json(req.body);

};

module.exports = {
  register,
  login,
  logout,
  refresh,
  user
}