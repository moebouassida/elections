const Candidate = require("../models/Candidat");
const Vote = require("../models/Vote");
const jwt = require("jsonwebtoken");  // Assuming you're using JWT for token generation/validation

// Middleware to check if user is authenticated
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send("Token required");

  jwt.verify(token, "your-secret-key", (err, decoded) => {
    if (err) return res.status(403).send("Invalid or expired token");
    req.user = decoded; // Attach the user info to the request object
    next();
  });
};

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

// Voting for a candidate (token authentication)
exports.vote = async (req, res) => {
  try {
    const { candidateId } = req.body;
    const userId = req.user.id;  // Getting user ID from the decoded token

    // Check if the user has already voted
    const existingVote = await Vote.findOne({ user: userId });
    if (existingVote) return res.status(400).send("User has already voted");

    // Save the vote and increment the candidate's vote count
    await new Vote({ user: userId, candidate: candidateId }).save();
    await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });

    res.send({ message: "Vote cast successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
