const Candidate = require("../models/Candidate");
const Vote = require("../models/Vote");

exports.getAllCandidates = async (req, res) => {
  const candidates = await Candidate.find();
  res.json(candidates);
};

exports.createCandidate = async (req, res) => {
  const candidate = new Candidate(req.body);
  await candidate.save();
  res.status(201).json(candidate);
};

exports.updateCandidate = async (req, res) => {
  const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(candidate);
};

exports.deleteCandidate = async (req, res) => {
  await Candidate.findByIdAndDelete(req.params.id);
  res.json({ message: "Candidate deleted successfully" });
};

exports.vote = async (req, res) => {
  const { candidateId } = req.body;
  const existingVote = await Vote.findOne({ user: req.user.id });
  if (existingVote) return res.status(400).send("User has already voted");
  await new Vote({ user: req.user.id, candidate: candidateId }).save();
  await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });
  res.send({ message: "Vote cast successfully" });
};