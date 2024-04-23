// controllers/cartController.js
const Cart = require('../models/Cart');

// Add item to cart
const addItemToCart = async (req, res, next) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Check if the user already has a cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // If the user doesn't have a cart, create a new one
      cart = new Cart({ user: userId, items: [{ product: productId, quantity }] });
    } else {
      // If the user already has a cart, check if the product already exists
      const existingItemIndex = cart.items.findIndex(item => item.product == productId);

      if (existingItemIndex !== -1) {
        // If the product already exists in the cart, update the quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // If the product doesn't exist in the cart, add it
        cart.items.push({ product: productId, quantity });
      }
    }

    // Save the cart
    await cart.save();

    res.status(200).json({ message: 'Item added to cart successfully', cart });
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
const removeItemFromCart = async (req, res, next) => {
    try {
      const { userId, productId } = req.params; // Changed from req.body to req.params
  
      // Find the user's cart
      const cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Remove the item from the cart
      cart.items = cart.items.filter(item => item.product != productId);
  
      // Save the updated cart
      await cart.save();
  
      res.status(200).json({ message: 'Item removed from cart successfully', cart });
    } catch (error) {
      next(error);
    }
  };
  
  // cartController.js

  const getUserCart = async (req, res, next) => {
    try {
      const { userId } = req.params; // Extract userId from request parameters
      const cart = await Cart.findOne({ user: userId }); // Find the user's cart based on userId
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  };
  

  

// // Get user's cart
// const getUserCart = async (req, res, next) => {
//   try {
//     const userId = req.params.userId;

//     // Find the user's cart
//     const cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     res.status(200).json(cart);
//   } catch (error) {
//     next(error);
//   }
// };
// Remove all items from cart
const removeAllItemsFromCart = async (req, res, next) => {
    try {
      const userId = req.params.userId;
  
      // Find the user's cart
      const cart = await Cart.findOne({ user: userId });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Empty the items array
      cart.items = [];
  
      // Save the updated cart
      await cart.save();
  
      res.status(200).json({ message: 'Cart emptied successfully', cart });
    } catch (error) {
      next(error);
    }
  };
  

// Increase quantity of item in cart
const increaseItemQuantity = async (req, res, next) => {
  try {
    const { userId, productId } = req.params;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item in the cart
    const item = cart.items.find(item => item.product == productId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Increase the quantity
    item.quantity++;

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Item quantity increased successfully', cart });
  } catch (error) {
    next(error);
  }
};

// Decrease quantity of item in cart
const decreaseItemQuantity = async (req, res, next) => {
  try {
    const { userId, productId } = req.params;

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item in the cart
    const item = cart.items.find(item => item.product == productId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Decrease the quantity if it's greater than 1
    if (item.quantity > 1) {
      item.quantity--;
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Item quantity decreased successfully', cart });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addItemToCart,
  removeItemFromCart,
  getUserCart,
  removeAllItemsFromCart,
  increaseItemQuantity,
  decreaseItemQuantity
};
