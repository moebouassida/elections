const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
    const user = await User.findById(decoded.id); // Find user by the ID from the token payload
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user; // Attach the user object to req.user
    next(); // Call next to pass control to the next middleware (your route handler)
  } catch (error) {
    console.error(error); // Log any errors
    res.status(401).json({ message: "Invalid token" }); // Return an error if the token is invalid
  }
};

module.exports = authMiddleware;
