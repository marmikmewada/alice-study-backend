// models/logo.js
const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true }
});

const Logo = mongoose.model('Logo', logoSchema);

module.exports = Logo;
