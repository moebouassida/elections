const User = require("../models/User");

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
