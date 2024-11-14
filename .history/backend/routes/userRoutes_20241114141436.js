const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.post("/register", userController.createUser);
router.get("/user", auth, userController.getUserProfile);
router.put("/update", auth, userController.updateUserProfile);
router.delete("/delete", auth, userController.deleteUser);

module.exports = router;
