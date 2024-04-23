// cartRoutes.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add', cartController.addItemToCart);
router.delete('/remove/:userId/:productId', cartController.removeItemFromCart);
router.get('/:userId', cartController.getUserCart); // Updated route to include userId parameter
router.delete('/remove-all/:userId', cartController.removeAllItemsFromCart);
router.put('/increase-quantity/:userId/:productId', cartController.increaseItemQuantity);
router.put('/decrease-quantity/:userId/:productId', cartController.decreaseItemQuantity);

module.exports = router;
