require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB, getMongoStatus } = require('./config/db');
const { syncMongoWithSeeds } = require('./services/store');

const trackRoutes = require('./routes/trackRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/tracks', trackRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/calculator', calculatorRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Udaan Skills Full-Stack Platform',
    timestamp: new Date().toISOString(),
    mongoConnected: getMongoStatus(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Static Production Client Serving & SPA Fallback
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API route not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// Startup
const startServer = async () => {
  await connectDB();
  await syncMongoWithSeeds();

  app.listen(PORT, () => {
    console.log(`[Udaan Skills Production Server] Listening on http://localhost:${PORT}`);
    console.log(`[Health Endpoint] http://localhost:${PORT}/api/health`);
  });
};

startServer();
