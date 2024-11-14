const express = require("express");
const connectDB = require("./config/db");
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/candidates", require("./routes/candidateRoutes"));

module.exports = app;
