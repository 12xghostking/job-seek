const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  if (!config.mongodbUrl) {
    console.warn('[DB Warning] MONGODB_URL is not defined in environment.');
    return;
  }

  try {
    const conn = await mongoose.connect(config.mongodbUrl);
    console.log(`[DB Success] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[DB Error] MongoDB connection failure: ${error.message}`);
    // In production, we log error rather than immediately terminating so health checks remain accessible
  }
};

module.exports = connectDB;
