const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register); // Register a user
router.post("/login", authController.login); // User login

module.exports = router;
