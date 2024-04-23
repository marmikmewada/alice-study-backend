const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateUser = require('../middlewares/authMiddleware');
const adminAuthorization = require('../middlewares/adminMiddleware');

// Define routes
router.post('/', authenticateUser, orderController.createOrder);
router.get('/:orderId', authenticateUser, adminAuthorization, orderController.getOrderById);
router.put('/updatepaystatus', authenticateUser, adminAuthorization, orderController.updatePaymentStatus); // Move this route up
router.get('/user/:userId', authenticateUser, orderController.getAllOrdersByUser); // This route is now after updatepaystatus
router.get('/', authenticateUser, adminAuthorization, orderController.getAllOrders);
router.put('/update-status', authenticateUser, adminAuthorization, orderController.updateOrderStatus);

module.exports = router;
