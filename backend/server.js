const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const config = require('./config/env');
const connectDB = require('./config/db');
const { errorHandler, notFoundHandler } = require('./middleware/error');
const { startKeepAlive } = require('./utils/keepAlive');

// Route imports
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');
const applicantRoutes = require('./routes/applicant.routes');
const notifRoutes = require('./routes/notif.routes');
const resumeRoutes = require('./routes/resume.routes');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows resume download in browser
}));

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, keep-alive)
    if (!origin) return callback(null, true);
    if (config.corsOrigin.includes('*') || config.corsOrigin.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev, logged in prod
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoints (Lightweight for Render & monitoring)
app.use('/health', healthRoutes);
app.use('/api/health', healthRoutes);

// API Routes
app.use('/api', authRoutes);
app.use('/api', jobRoutes);
app.use('/api', applicantRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/notifications', notifRoutes);
app.use('/api', resumeRoutes);

// Backward Compatibility Aliases for Legacy Endpoints
app.use('/', applicantRoutes); // Supports legacy /approve and /reject

// 404 & Centralized Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  // Connect to DB asynchronously so HTTP port opens immediately for Render health checks
  connectDB().catch((err) => {
    console.error('[DB Startup Error]', err.message);
  });

  const server = app.listen(config.port, () => {
    console.log(`========================================`);
    console.log(`🚀 Job-Seek Server running on port ${config.port}`);
    console.log(`🌐 Environment: ${config.nodeEnv}`);
    console.log(`💓 Health endpoint: http://localhost:${config.port}/health`);
    console.log(`========================================`);

    // Launch Render free-tier keep-alive ping if configured
    startKeepAlive();
  });

  // Graceful shutdown handling
  const handleShutdown = () => {
    console.log('[Server] Shutting down gracefully...');
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);

  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };