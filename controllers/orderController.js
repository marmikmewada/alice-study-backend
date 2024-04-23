// ordersController.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product')

// Create order function
// Create order function
const createOrder = async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate order total
    let totalAmount = 0;
    for (const item of cart.items) {
      // Fetch product details from the database
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product with ID ${item.product} not found` });
      }
      totalAmount += item.quantity * product.price;
    }

    // Create the order with payment status as 'pending'
    const order = new Order({
      user: userId,
      items: cart.items,
      totalAmount,
      status: 'placed',
      payment: 'pending', // Payment status set to 'pending'
    });

    // Save the order to the database
    await order.save();

    // Empty the user's cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    next(error);
  }
};

// Get order by ID function
const getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    // Find the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Get all orders by user ID
const getAllOrdersByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Find all orders for the given user
    const orders = await Order.find({ user: userId });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Get all orders
const getAllOrders = async (req, res, next) => {
  try {
    // Find all orders and sort them by createdAt field in descending order
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Update order status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId, status } = req.body;

    // Find the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the order status
    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    next(error);
  }
};

// Update payment status
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { orderId, payment } = req.body;

    // Find the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the payment status
    order.payment = payment;
    await order.save();

    res.status(200).json({ message: 'Payment status updated successfully', order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrdersByUser,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
};
