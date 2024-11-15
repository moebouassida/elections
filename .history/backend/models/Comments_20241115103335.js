// models/Comment.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  commentText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", commentSchema);
