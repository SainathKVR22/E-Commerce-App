const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config/config');
const db = require('./mongodb/db');
const productController = require('./controllers/products.controller');

const app = express();

app.use(bodyParser.json());

app.post('/products', productController.createProduct);
app.get('/getProductDetails', productController.getProductById);
app.post('/update/variants', productController.updateProduct);
app.delete('/delete/product/variants', productController.deleteProduct);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
