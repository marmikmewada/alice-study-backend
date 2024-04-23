// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../config/jwt');

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed. No token provided.' });
    }
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
  }
};

module.exports = authenticateUser;
