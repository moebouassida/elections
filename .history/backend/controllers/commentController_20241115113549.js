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
  

  exports.getCommentsByCandidate = async (req, res) => {
    try {
      const { candidateId } = req.params; // Get candidateId from params
  
      // Fetch the comments for the specified candidate
      const comments = await Comment.find({ candidate: candidateId })
        .populate("user", "nom prenom")
        .sort({ createdAt: -1 }); // Sort by newest first
  
      // Check if no comments are found for the candidate
      if (comments.length === 0) {
        return res.status(404).json({ message: "No comments found for this candidate" });
      }
  
      // Return the comments if they exist
      res.status(200).json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Error fetching comments", error: error.message });
    }
  };
  
exports.deleteComment = async (req, res) => {
    try {
      const { commentId } = req.params; 
      const userId = req.user._id; // Get user ID from token middleware

      // Find the comment by ID
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // Ensure that the logged-in user is the owner of the comment
      if (comment.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: "You are not authorized to delete this comment" });
      }
  
      // Delete the comment
        await Comment.deleteOne({ _id: commentId }); // Use deleteOne instead of remove
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Error deleting comment", error: error.message });
    }
  };
  