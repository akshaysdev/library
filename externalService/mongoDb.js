const mongoose = require('mongoose');

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.MONGODB_NAME,
};

mongoose.Promise = global.Promise;

/* Creating a connection to the MongoDB database. */
const mongoDb = mongoose.createConnection(process.env.MONGODB_URI, mongooseOptions, (err) => {
  if (!err) {
    console.log('Connected to MongoDB...');
  }
});

module.exports = { mongoDb };
