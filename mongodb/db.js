const mongoose = require('mongoose');
const { db } = require('../config/config');

mongoose
  .connect(db.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error('Failed to connect to the database', err);
    process.exit(1);
  });
