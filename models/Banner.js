// models/banner.js
const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  imageUrls: [{ type: String, required: true, min: 1 }] // Minimum 1 image URL required
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
