const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.createUser = async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;

    // Check if all required fields are provided
    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
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

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        favorites: user.favorites,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error); // Log error to console
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getUserProfile = async (req, res) => {
  try {
    // Find the user by their ID from the token (middleware 'auth' should set req.user)
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;
    
    // Hash new password if provided
    const updateData = { nom, prenom, email };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10); // Hash password if it's part of the update
    }

    // Update the user by ID
    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
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
