const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.post("/register", userController.createUser);
router.get("/profile", userController.getUserProfile);
router.put("/profile", userController.updateUserProfile);
router.delete("/profile", userController.deleteUser);

module.exports = router;
