const mongoose = require('mongoose');

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) {
    console.log('=> Using existing MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not set');

    // Create the connection promise once and reuse it
    cached.promise = mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      maxPoolSize: 10,
    }).then((mongooseInstance) => {
      console.log('=> Connected to MongoDB');
      return mongooseInstance;
    }).catch((err) => {
      console.error('MongoDB connection error:', err);
      cached.promise = null; // reset so we can retry later
      throw err;
    });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached; // ensure global cache is set
  return cached.conn;
}

module.exports = connectDB;