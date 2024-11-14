const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.get("/user", auth, userController.getUserProfile); // get user by id
router.get("/users", auth, userController.getUserProfile); // get all users
router.get("/favorites", authenticate, getFavoriteCandidates); // Get favorites

router.put("/update", auth, userController.updateUserProfile); // update user info

router.post("/favorites", authenticate, addFavoriteCandidate); // Add to favorites
router.post("/register", userController.createUser); // Add a user

router.delete("/delete", auth, userController.deleteUser); // delete user
router.delete("/favorites", authenticate, removeFavoriteCandidate); // Remove from favorites

module.exports = router;
