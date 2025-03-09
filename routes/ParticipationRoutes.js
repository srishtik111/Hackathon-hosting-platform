const express = require("express");
const multer = require("multer");
const path = require("path");
const Participant = require("../models/Participant");

const router = express.Router();

// Configure storage for uploaded resumes
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Route to handle registration
router.post("/register", upload.single("resume"), async (req, res) => {
    try {
        const { name, email, phone, age, degree, college, github, linkedin, skills } = req.body;

        // Convert skills from string to array (if needed)
        const skillsArray = typeof skills === "string" ? skills.split(",") : skills;

        const newParticipant = new Participant({
            name,
            email,
            phone,
            age,
            degree,
            college,
            github,
            linkedin,
            skills: skillsArray,
            resume: req.file.path, // Store resume file path
        });

        await newParticipant.save();
        res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
