const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');
const authenticateUser = require('../middlewares/authMiddleware'); // Import auth middleware
const adminAuthorization = require('../middlewares/adminMiddleware'); // Import admin middleware
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5 MB
    }
  });

// Define routes
router.post('/createproduct', authenticateUser, adminAuthorization, upload.array('images'), productController.createProduct); // Requires admin authorization
router.delete('/:productId', authenticateUser, adminAuthorization, productController.deleteProduct); // Requires admin authorization
router.post('/search', productController.getSearchedProducts); // Change to POST method
router.get('/allproducts', productController.getAllProducts);
router.get('/:productId', productController.getProductById); // This route should be last

module.exports = router;
