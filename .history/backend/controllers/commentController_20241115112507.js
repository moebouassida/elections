// controllers/commentController.js
const Comment = require("../models/Comments");

// Add a comment
exports.addComment = async (req, res) => {
    try {
      const { candidateId, commentText } = req.body;

      const userId = req.user.id; // Get user ID from token middleware
      const comment = new Comment({ candidate: candidateId, user: userId, commentText });
      await comment.save();
  
      res.status(201).json({ message: "Comment added successfully", comment });
    } catch (error) {
      res.status(500).json({ message: "Error adding comment", error });
    }
  };
  

// Get comments for a candidate
exports.getCommentsByCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params.id;
    const comments = await Comment.find({ candidate: candidateId })
      .populate("user", "nom prenom")
      .sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
};

exports.deleteComment = async (req, res) => {
    try {
      const { commentId } = req.params.id;
      const userId = req.user.id; // Get user ID from token middleware
      console.log(userId)
      console.log(commentId)
      const comment = await Comment.findById(commentId);
      if (!comment) return res.status(404).json({ message: "Comment not found" });
      console.log(comment.user.toString())
      console.log(userId)
      if (comment.user.toString() !== userId) {
        return res.status(403).json({ message: "You are not authorized to delete this comment" });
      }
  
      await comment.remove();
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting comment", error });
    }
  };
  