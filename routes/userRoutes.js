// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateUser = require('../middlewares/authMiddleware'); // Import auth middleware

// Define routes
router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
router.get('/:userId', authenticateUser, userController.getUserProfile); // Apply auth middleware here

module.exports = router;
