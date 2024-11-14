const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.post("/register", userController.createUser); // Add a user
router.get("/user", auth, userController.getUserProfile); // get user by id
router.put("/update", auth, userController.updateUserProfile); // update user info
router.delete("/delete", auth, userController.deleteUser); // delete user
router.post("/favorites", authenticate, addFavoriteCandidate); // Add to favorites
router.delete("/favorites", authenticate, removeFavoriteCandidate); // Remove from favorites
router.get("/favorites", authenticate, getFavoriteCandidates); // Get favorites

module.exports = router;
