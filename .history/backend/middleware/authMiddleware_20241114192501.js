const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct

const authMiddleware = async (req, res, next) => {
  // Get token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // If no token is provided, return a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key

    // Find the user associated with the ID from the decoded token
    const user = await User.findById(decoded.userId); // Assuming the token contains 'userId'
    
    // If no user is found, return a 401 Unauthorized response
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach the user to the request object for further use
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle different errors for clarity
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }

    // Log other errors for debugging
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = authMiddleware;