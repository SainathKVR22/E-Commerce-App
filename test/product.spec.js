const axios = require('axios');
const mongoose = require('mongoose');
const Product = require('../mongodb/models/product');

describe('Product API Endpoints', () => {
    let product;
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    // afterEach(async () => {
    //     await Product.deleteMany({});
    // });

    it('should create a new product', async () => {
        const productData = {
            "name": "Laptop",
            "description": "Powerful and lightweight laptop",
            "price": 999.99,
            "variants": [
                {
                    "name": "Variant 1",
                    "sku": "LP-V1",
                    "additionalCost": 0,
                    "stockCount": 10
                },
                {
                    "name": "Variant 2",
                    "sku": "LP-V2",
                    "additionalCost": 100,
                    "stockCount": 5
                },
                {
                    "name": "Variant 4",
                    "sku": "LP-V4",
                    "additionalCost": 50,
                    "stockCount": 20
                }
            ]
        }
        const response = await axios.post('http://localhost:3000/products', productData);
        product = response.data;
        expect(response.status).toBe(200);
        expect(response.data.name).toBe(productData.name);
        expect(response.data.description).toBe(productData.description);
        expect(response.data.price).toBe(productData.price);
        expect(Array.isArray(response.data.variants)).toBe(true);
        if (response.data.variants.length > 0) {
            let expectedColumns = ['name', 'sku', 'additionalCost', 'stockCount'];
            for (let column of expectedColumns) {
                expect(response.data.variants[0]).toHaveProperty(column);
            }
        }
    });

    it('should retrieve a product by ID', async () => {
        const response = await axios.get(`http://localhost:3000/getProductDetails?id=${product._id}`);
        expect(response.status).toBe(200);
    });

    it('should update variants of a product', async () => {
      
        const variantUpdates = [
          { _id: product.variants[0]._id,
            name: product.variants[0].name,
            sku: product.variants[0].sku,
            additionalCost: 20,
            stockCount: product.variants[0].stockCount
        },
          { _id: product.variants[1]._id, 
            name: product.variants[1].name,
            sku: product.variants[1].sku,
            additionalCost: product.variants[1].additionalCost,
            stockCount: 15
         }
        ];
        const response = await axios.post('http://localhost:3000/update/variants', {
          productId: product._id,
          variantUpdates: variantUpdates
        });
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Variants updated successfully');
        expect(response.data.product[0].additionalCost).toBe(20);
        expect(response.data.product[1].stockCount).toBe(15);
      });

    //   To delete only variants 
      it('should delete variants from a product', async () => {
      
        const variantIds = `["${product.variants[0]._id}", "${product.variants[1]._id}"]`;
      
        const response = await axios.delete('http://localhost:3000/delete/product/variants', {
            params: {
                productId: `"${product._id}"`,
                variantIds: variantIds,
                flag : 'true'
            },
            headers: {
                'Content-Type': 'application/json'
              }
        });
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Variants deleted successfully');
      });

    //   To delete the product also
      it('should delete product from db', async () => {
      
        const response = await axios.delete('http://localhost:3000/delete/product/variants', {
            params: {
                productId: `"${product._id}"`,
                flag : 'false'
            },
            headers: {
                'Content-Type': 'application/json'
              }
        });
        expect(response.status).toBe(200);
        if (response.data) {
            expect(response.data.name).toBeDefined();
            expect(Array.isArray(response.data.variants)).toBe(true);
            if (response.data.variants.length > 0) {
                let expectedColumns = ['name', 'sku', 'additionalCost', 'stockCount'];
                for (let column of expectedColumns) {
                    expect(response.data.variants[0]).toHaveProperty(column);
                }
            }
        } 
      });
      

});
