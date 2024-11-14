const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");

router.get("/candidates", candidateController.getAllCandidates);
router.post("/cadidate", candidateController.createCandidate);
router.put("/:id", candidateController.updateCandidate);
router.delete("/:id", candidateController.deleteCandidate);
router.post("/vote", candidateController.vote);

module.exports = router;
