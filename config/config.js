require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    connectionString: process.env.MONGODB_URI || 'mongodb://localhost/products',
  },
};
