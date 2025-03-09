const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
  hack_name: { type: String, required: true },
  theme: { type: String, required: true },
  problem_statement: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  prize: { type: String, required: true },
  guidelines: { type: String },
  participation_type: { type: String, required: true },
  min_team_size: { type: Number },
  max_team_size: { type: Number }
});

module.exports = mongoose.model('Hackathon', hackathonSchema);