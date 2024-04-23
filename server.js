const express = require('express');
const cors = require('cors');
const connectDB = require('./config/mongodb');
const firebase = require('./config/firebase');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');
const logoBannerRoutes = require('./routes/logoBannerRoutes');

async function startServer() {
    try {
        // Create express app
        const app = express();

        // Connect to MongoDB
        await connectDB();

        // Middleware
        app.use(express.json());
        app.use(cors());

        // Routes
        app.use('/users', userRoutes);
        app.use('/carts', cartRoutes);
        app.use('/products', productRoutes);
        app.use('/reviews', reviewRoutes);
        app.use('/orders', orderRoutes);
        app.use('/logo-banner', logoBannerRoutes);

        // Wildcard route for logging
        app.all('*', (req, res) => {
            console.log(`Received ${req.method} request to ${req.originalUrl}`);
            res.status(404).json({ message: 'Route not found' });
        });

        // Start the server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();
