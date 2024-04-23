// models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    availability: { type: String, enum: ['instock', 'outofstock'], default: 'instock' },
    isFeatured: { type: Boolean, default: false },
    sizes: [{ type: String }],
    colors: [{ type: String }]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
