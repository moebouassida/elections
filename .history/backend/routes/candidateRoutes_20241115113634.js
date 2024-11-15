const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");

router.get("/candidates", candidateController.getAllCandidates);
router.get("/:id", candidateController.getCandidateById);
router.get("/search", candidateController.searchCandidates);
router.post("/candidate", candidateController.createCandidate);
router.delete("/:id", candidateController.deleteCandidate);

module.exports = router;
