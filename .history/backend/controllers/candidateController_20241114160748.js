const Candidate = require("../models/Candidat");
const Vote = require("../models/Vote");
const jwt = require("jsonwebtoken");  // Assuming you're using JWT for token generation/validation

// Get all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get candidate by ID
exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new candidate (manually added in the backend)
exports.createCandidate = async (req, res) => {
  try {
    const candidate = new Candidate(req.body); // Assuming candidate data is passed in body
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a candidate by ID (admin only)
exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    
    if (!candidate) {
      // Candidate not found
      return res.status(404).json({ message: "Candidate not found" });
    }
    
    // Candidate successfully deleted
    res.json({ message: "Candidate deleted successfully" });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


