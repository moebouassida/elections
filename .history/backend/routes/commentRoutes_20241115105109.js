const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const auth = require("../middleware/authMiddleware");

// Add a comment
router.post("/", auth, commentController.addComment);

// Get comments for a specific candidate (no token needed)
router.get("/:candidateId", commentController.getCommentsByCandidate);

// Delete a comment (only by the user who created it)
router.delete("/:commentId", auth, commentController.deleteComment);

module.exports = router;
