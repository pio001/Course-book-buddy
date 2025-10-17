const mongoose = require('mongoose');

let isConnected = 0;

const connectDB = async () => {
  if (isConnected === 1) {
    console.log('=> Using existing MongoDB connection');
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Keep connection attempts short to avoid serverless timeouts on first cold start
      serverSelectionTimeoutMS: 5000,
      // Reasonable pool size for serverless
      maxPoolSize: 10,
    });
    isConnected = conn.connections[0].readyState;
    console.log('=> Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

module.exports = connectDB;