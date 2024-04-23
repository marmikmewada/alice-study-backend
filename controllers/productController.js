const Product = require('../models/Product');
const firebaseStorage = require('../config/firebase');
const { getSignedUrl } = require('firebase-admin/storage');
const multer = require('multer');
const { validationResult } = require('express-validator');

// Multer configuration for file uploads (already defined outside)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
});

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, sizes, colors } = req.body;
    const uploadedImageUrls = [];

    if (req.files) {
      for (const file of req.files) {
        const imageFile = file.buffer;
        const fileName = file.originalname;

        try {
          const fileRef = firebaseStorage.bucket().file(fileName);
          const stream = fileRef.createWriteStream({ metadata: { contentType: file.mimetype } });

          stream.on('error', (error) => {
            console.error('Error uploading image:', error);
            res.status(500).json({ error: 'Failed to upload image(s)' });
            return; // Stop further execution
          });

          stream.on('finish', async () => {
            try {
              // Get the signed URL for the file
              const [url] = await fileRef.getSignedUrl({
                action: 'read',
                expires: '01-01-2030', // Set an expiration date for the URL
              });
              console.log(`Successfully uploaded image: ${fileName}`);
              uploadedImageUrls.push(url);

              if (uploadedImageUrls.length === req.files.length) {
                const newProductData = {
                  name,
                  description,
                  price,
                  sizes,
                  colors,
                  images: uploadedImageUrls
                };
                const newProduct = new Product(newProductData);
                await newProduct.save();
                res.status(201).json({ message: 'Product created successfully', product: newProduct });
              }
            } catch (error) {
              console.error('Error getting download URL:', error);
              res.status(500).json({ error: 'Failed to get download URL for image(s)' });
            }
          });

          stream.end(imageFile);
        } catch (error) {
          console.error('Error uploading image:', error);
          res.status(500).json({ error: 'Failed to upload image(s)' });
          return; // Stop further execution
        }
      }
    }
  } catch (error) {
    next(error);
  }
};




// Delete product function
const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    // Find the product by ID
    const product = await Product.findById(productId);

    // If product not found, return error
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete product from the database
    await product.remove();

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get all products function
const getAllProducts = async (req, res, next) => {
    try {
      // Fetch all products from the database
      const products = await Product.find();
  
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

// Get product by ID function
const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    // Find the product by ID
    const product = await Product.findById(productId);

    // If product not found, return error
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const getSearchedProducts = async (req, res, next) => {
  try {
    // Extract and validate search term from req.body
    const { keyword } = req.body;
    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({ message: 'Invalid keyword' });
    }

    // Perform search query based on the keyword
    const products = await Product.find({ name: { $regex: keyword, $options: 'i' } });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};



// Get products by category function
const getProductsByCategory = async (req, res, next) => {
    try {
      const categoryId = req.query.categoryId;
  
      // Validate categoryId parameter
      if (!categoryId || typeof categoryId !== 'string') {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
  
      // Find products by category
      const products = await Product.find({ category: categoryId });
  
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    getSearchedProducts,
    getProductsByCategory
  };