const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
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


    // Send response with JWT
    res.status(201).json({
      message: "User registered successfully",
      user: {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        favorites: user.favorites,
      }});
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};