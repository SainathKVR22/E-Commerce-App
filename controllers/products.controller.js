const { default: mongoose } = require('mongoose');
const Product = require('../mongodb/models/product');

exports.createProduct = async (req, res) => {
  const { name, description, price, variants } = req.body;
  try {
    const product = new Product({
      name,
      description,
      price,
      variants: []
    });

    for (let variant of variants) {
      product.variants.push({
        name: variant.name,
        sku: variant.sku,
        additionalCost: variant.additionalCost,
        stockCount: variant.stockCount
      });
    }

    const savedProduct = await product.save();

    res.json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getProductById = (req, res) => {
  const  id  = req.query.id;
  Product.findById(id)
    .populate('variants')
    .exec()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

exports.updateProduct = async (req, res) => {
  const productId = req.body.productId;
  const variantUpdates = req.body.variantUpdates;
  let result = [];
  let item = 0;
  for (let variantUpdate of variantUpdates) {
    try {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, 'variants._id': variantUpdate._id },
        {
          $set: {
            'variants.$.name': variantUpdate.name,
            'variants.$.sku': variantUpdate.sku,
            'variants.$.additionalCost': variantUpdate.additionalCost,
            'variants.$.stockCount': variantUpdate.stockCount
          }
        },
        { new: true });
      result.push(updatedProduct.variants[item]);
      item++;
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  res.json({ message: 'Variants updated successfully', product: result });
};


exports.deleteProduct = async (req, res) => {
  let productId = JSON.parse(req.query.productId);
  let flag = JSON.parse(req.query.flag)
  if (productId && flag) {
    try {
      let variantIds = JSON.parse(req.query.variantIds)
      const result = await Product.updateOne(
        { _id: productId },
        { $pull: { variants: { _id: { $in: variantIds } } } }
      );

      if (result.nModified === 0) {
        return res.status(404).json({ error: 'Variants not found or not modified' });
      }

      res.json({ message: 'Variants deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    try {
      const product = await Product.findByIdAndDelete(productId);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
