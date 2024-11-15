// controllers/commentController.js
const Comment = require("../models/Comments");

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const { candidateId, userId, commentText } = req.body;
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
    const { candidateId } = req.params;
    const comments = await Comment.find({ candidate: candidateId })
      .populate("user", "nom prenom")
      .sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { commentText } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { commentText },
      { new: true }
    );
    if (!updatedComment) return res.status(404).json({ message: "Comment not found" });
    res.status(200).json({ message: "Comment updated", updatedComment });
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) return res.status(404).json({ message: "Comment not found" });
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
};
