const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Root health check endpoint
app.get('/', (req, res) => {
  res.send('Agrinova Backend Server is running 100% operational 🚀');
});

// Database Connection & Server Start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('connected to MongoDB successfully 🍃');
    app.listen(PORT, () => {
      console.log(`Server is cooking on port ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });