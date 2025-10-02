// Import Mongoose for MongoDB connection
const mongoose = require("mongoose");

/**
 * Connect to MongoDB database
 * @param {string} url - MongoDB connection string
 * @returns {Promise} - Mongoose connection promise
 * @description Establishes connection to MongoDB using provided URL
 */
const connectDB = (url) => {
  return mongoose.connect(url, {});
};

// Export the connection function
module.exports = connectDB;