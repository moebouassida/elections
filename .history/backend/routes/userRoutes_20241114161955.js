const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");


router.get("/user", auth, userController.getUserProfile); // get user by id
router.get("/users", auth, userController.getUserProfile); // get all users
router.get("/favorites", auth, userController.getFavoriteCandidates); // Get favorites

router.put("/update", auth, userController.updateUserProfile); // update user info

router.post("/favorites", auth, userController.addFavoriteCandidate); // Add to favorites
router.post("/register", userController.register); // Add a user
router.post("/vote", auth, userController.vote); // Add a vote

router.delete("/delete", auth, userController.deleteUser); // delete user
router.delete("/favorites", auth, userController.removeFavoriteCandidate); // Remove from favorites

module.exports = router;
