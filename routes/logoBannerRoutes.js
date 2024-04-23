// logoBannerRoutes.js
const express = require('express');
const router = express.Router();
const logoBannerController = require('../controllers/logoBannerController');
const adminAuthorization = require('../middlewares/adminMiddleware'); // Import admin middleware
const authenticateUser = require('../middlewares/authMiddleware'); // Import auth middleware

// Define routes
router.post('/upload-logo', authenticateUser, adminAuthorization, logoBannerController.uploadLogo); // Requires authentication and admin authorization
router.get('/logo', logoBannerController.getLogo);
router.post('/upload-banner', authenticateUser, adminAuthorization, logoBannerController.uploadBannerImages); // Requires authentication and admin authorization
router.get('/banner', logoBannerController.getBannerImages);

module.exports = router;
