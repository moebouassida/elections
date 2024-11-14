const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");  // Import jsonwebtoken
const User = require("../models/User");
const Candidate = require("../models/Candidat")

exports.createUser = async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;

    // Check if all required fields are provided
    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate the email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      nom,
      prenom,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    // Generate JWT (with a secret key and payload)
    const payload = { id: user._id };
    
    // Generate token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Log the token for debugging
    console.log("Generated token:", token);

    // Send response with JWT
    res.status(201).json({
      message: "User registered successfully",
      user: {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        favorites: user.favorites,
      },
      token: token,  // Include the JWT in the response
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Find all users in the database
    const users = await User.find();

    // Check if users exist
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Send the list of users as the response
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    // Make sure req.user is properly populated by the middleware
    if (!req.user) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    // Find the user by their ID from the token (req.user.id should be set by auth middleware)
    const user = await User.findById(req.user.id).populate("favorites");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // Send the user profile as the response
  } catch (error) {
    console.error(error); // Log the error to understand what went wrong
    res.status(500).json({ message: "Server error" }); // General server error message
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { password } = req.body;

    // If a password is provided, hash it before updating
    if (password) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user password by ID
      const user = await User.findByIdAndUpdate(
        req.user.id, 
        { password: hashedPassword }, 
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove the password from the response
      const { password: excludedPassword, ...userWithoutPassword } = user.toObject();

      // Return the updated user without the password field
      res.json(userWithoutPassword);
    } else {
      return res.status(400).json({ message: "Password is required" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    // Delete the user by their ID
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller method to add a favorite candidate
exports.addFavoriteCandidate = async (req, res) => {
  try {
    const { candidateId } = req.body; // Candidate ID to add to favorites

    // Validate that a candidate ID is provided
    if (!candidateId) {
      return res.status(400).json({ message: "Candidate ID is required" });
    }

    // Check if the candidate exists (you should have a Candidate model for this)
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Add the candidate to the user's favorites
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the candidate ID to the favorites array if it's not already added
    if (!user.favorites.includes(candidateId)) {
      user.favorites.push(candidateId);
      await user.save();
      return res.status(200).json({ message: "Candidate added to favorites", favorites: user.favorites });
    } else {
      return res.status(400).json({ message: "Candidate is already in favorites" });
    }
  } catch (error) {
    console.error("Error adding favorite candidate:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller method to remove a favorite candidate
exports.removeFavoriteCandidate = async (req, res) => {
  try {
    const { candidateId } = req.body; // Candidate ID to remove from favorites

    // Validate that a candidate ID is provided
    if (!candidateId) {
      return res.status(400).json({ message: "Candidate ID is required" });
    }

    // Check if the candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Find the user and remove the candidate from the favorites
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the candidate ID from the favorites array
    user.favorites = user.favorites.filter((id) => id.toString() !== candidateId);
    await user.save();

    res.status(200).json({ message: "Candidate removed from favorites", favorites: user.favorites });
  } catch (error) {
    console.error("Error removing favorite candidate:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Controller method to get a user's favorite candidates
exports.getFavoriteCandidates = async (req, res) => {
  try {
    // Find the user and populate the favorites field with candidate data
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.favorites); // Return the user's favorite candidates
  } catch (error) {
    console.error("Error fetching favorite candidates:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
