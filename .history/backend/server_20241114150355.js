require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const connectDB = require('./config/db'); // Ensure this is exported correctly
const userRoutes = require('./routes/userRoutes'); // Import user routes

const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON requests

// Connect to MongoDB
connectDB();


// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong!' });
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
