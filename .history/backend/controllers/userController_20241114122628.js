const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.createUser = async (req, res) => {
    try {
      const { nom, prenom, email, password } = req.body;
  
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
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
}

exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id).populate("favorites");
  res.json(user);
};

exports.updateUserProfile = async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true });
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.json({ message: "User deleted successfully" });
};
