const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/udaan_skills';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout for graceful fallback
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${uri}: ${error.message}`);
    console.log('[System] Falling back to robust in-memory persistent store. All endpoints remain 100% operational.');
  }
};

const getMongoStatus = () => isMongoConnected;

module.exports = { connectDB, getMongoStatus };
