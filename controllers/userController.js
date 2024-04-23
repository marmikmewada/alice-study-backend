// controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { secret } = require('../config/jwt');
// Import Order model
const Order = require('../models/Order');

// Signup function
const signUp = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      
      // Check if name field is provided
      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }
  
      // Check if user with the same email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword
      });
  
      // Save the user to the database
      await newUser.save();
  
      // Generate JWT token
      const token = jwt.sign({ userId: newUser._id }, secret, { expiresIn: '1h' });
  
      // Send response with token and user details
      res.status(201).json({ token, user: newUser });
    } catch (error) {
      next(error);
    }
  };
  

// Signin function
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Handle user not found case
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password and handle invalid password case
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token on successful login
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '29d' });

    // Send response with token and user details on success
    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};
  
// Get user profile
// Get user profile with previous orders
const getUserProfile = async (req, res, next) => {
    try {
      // Get user details from request object (authenticated user)
      const { _id, name, email } = req.user;
      
      // Fetch user's previous orders with all details
      const userWithOrders = await Order.find({ user: _id });
  
      // Construct response object with user details and previous orders
      const userProfile = {
        _id,
        name,
        email,
        previousOrders: userWithOrders
      };
  
      res.status(200).json(userProfile);
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  signUp,
  signIn,
  getUserProfile
};
