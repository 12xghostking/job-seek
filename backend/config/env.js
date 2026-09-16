const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUrl: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/job-seek',
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_key_change_in_production_32chars!',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
  healthCheckUrl: process.env.HEALTH_CHECK_URL || '',
  healthCheckIntervalMinutes: parseInt(process.env.HEALTH_CHECK_INTERVAL_MINUTES, 10) || 14,
};

module.exports = config;
