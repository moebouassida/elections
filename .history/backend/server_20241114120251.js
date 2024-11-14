require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db'); // Ensure you have this exported correctly
const userRoutes = require('./routes/userRoutes'); // Import user routes

const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON requests

// Connect to MongoDB
connectDB();

// Define routes
app.use('/api/users', userRoutes); // Define route for user-related endpoints
// Add other routes here, such as for voting, candidates, etc.

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
