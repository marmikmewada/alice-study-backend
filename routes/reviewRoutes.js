// reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authenticateUser = require('../middlewares/authMiddleware'); // Import auth middleware
const adminAuthorization = require('../middlewares/adminMiddleware');
// Define routes
router.post('/createreview', authenticateUser, reviewController.createReview); // Requires authentication
router.get('/:productId', reviewController.getAllReviewsForProduct);
router.get('/user/:userId', reviewController.getAllReviewsForAllProducts);
router.delete('/:reviewId', authenticateUser,adminAuthorization, reviewController.deleteReview); // Requires authentication

module.exports = router;
