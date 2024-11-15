const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const auth = require("../middleware/authMiddleware");

// Add a comment
router.post("/add", auth, commentController.addComment);

// Get comments for a specific candidate (no token needed)
router.get("/:id", commentController.getCommentsByCandidate);

// Delete a comment (only by the user who created it)
router.delete("/:id", auth, commentController.deleteComment);

module.exports = router;
