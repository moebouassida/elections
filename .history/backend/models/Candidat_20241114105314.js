const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  biography: String,
  program: String,
  votes: { type: Number, default: 0 },
});

module.exports = mongoose.model("Candidate", candidateSchema);
