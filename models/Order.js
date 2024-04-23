// models/order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['placed', 'shipped', 'delivered', 'cancelled'], default: 'placed' }, // Default status set to 'placed'
  payment: { type: String, enum: ['pending', 'paid'], default: 'pending' } // Change default value to 'pending'
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
