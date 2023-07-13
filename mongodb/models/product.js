const mongoose = require('mongoose');
const variantSchema = require('./variant');


const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  variants: [variantSchema]
});

module.exports = mongoose.model('Product', productSchema);