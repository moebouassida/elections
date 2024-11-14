const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const auth = require("../middleware/authMiddleware");

router.get("/", candidateController.getAllCandidates);
router.post("/", auth, candidateController.createCandidate);
router.put("/:id", auth, candidateController.updateCandidate);
router.delete("/:id", auth, candidateController.deleteCandidate);
router.post("/vote", auth, candidateController.vote);

module.exports = router;
