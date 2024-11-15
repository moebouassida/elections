const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");

router.get("/candidates", candidateController.getAllCandidates); // Get candidates
router.get("/:id", candidateController.getCandidateById); // Get candidate by id
router.post("/search", commentController.searchCandidates); // Search candidates
router.post("/candidate", candidateController.createCandidate); // Create candidate
router.delete("/:id", candidateController.deleteCandidate); // Delete candidate

module.exports = router;
