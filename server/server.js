const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
// file-level setup (no route changes required)
const connectDB = require('./config/connectDB');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Always mount at '/api' so Vercel catch-all matches
const prefix = process.env.VERCEL ? '' : '/api';

// Routes
app.use(`${prefix}/auth`, require('./routes/auth'));
app.use(`${prefix}/users`, require('./routes/users'));
app.use(`${prefix}/books`, require('./routes/books'));
app.use(`${prefix}/courses`, require('./routes/courses'));
app.use(`${prefix}/departments`, require('./routes/departments'));
app.use(`${prefix}/orders`, require('./routes/orders'));
app.use(`${prefix}/cart`, require('./routes/cart'));
app.use(`${prefix}/wishlist`, require('./routes/wishlist'));
app.use(`${prefix}/reviews`, require('./routes/reviews'));
app.use(`${prefix}/upload`, require('./routes/upload'));

// Default route
app.get('/', (req, res) => {
  res.send('UniBookshop API is running');
});

// Connect to MongoDB (cached)
connectDB();

const PORT = process.env.PORT || 5000;
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}