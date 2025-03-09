const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    degree: { type: String, required: true },
    college: { type: String, required: true },
    github: { type: String, required: true },
    linkedin: { type: String, required: true },
    skills: { type: [String], required: true },
    resume: { type: String, required: true }, // Will store file path
});

module.exports = mongoose.model("Participant", participantSchema);
