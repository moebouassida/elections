const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming your user model is here

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
    const user = await User.findById(decoded.id); // Fetch user by ID from decoded token
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user; // Attach user to request object
    next(); // Proceed to the next middleware (your controller function)
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
