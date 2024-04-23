const { validationResult, check } = require('express-validator');
const Review = require('../models/Review');
const Order = require('../models/Order');

// Create a new review
const createReview = async (req, res, next) => {
  try {
    const { userId, productId, rating, comment } = req.body;

    // Check if the user's order payment status is 'paid'
    const order = await Order.findOne({ user: userId, payment: 'paid' });

    if (!order) {
      return res.status(400).json({ message: 'You can only create a review if your order payment status is paid' });
    }

    // Validation for userId, productId, rating, and comment fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if comment length exceeds 200 characters
    if (comment.length > 200) {
      return res.status(400).json({ message: 'Comment cannot exceed 200 characters' });
    }

    // Create a new review
    const review = new Review({
      user: userId,
      product: productId,
      rating,
      comment
    });

    // Save the review to the database
    await review.save();

    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    next(error);
  }
};

// Get all reviews for a product
const getAllReviewsForProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    // Find all reviews for the given product
    const reviews = await Review.find({ product: productId });

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

// Get all reviews for all products
const getAllReviewsForAllProducts = async (req, res, next) => {
  try {
    // Find all reviews
    const reviews = await Review.find();

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

// Delete a review
const deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;

    // Find the review by ID and delete it
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getAllReviewsForProduct,
  getAllReviewsForAllProducts,
  deleteReview
};
