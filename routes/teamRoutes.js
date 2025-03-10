const express = require("express");
const router = express.Router();
const Team = require("../models/team");

// ✅ Create Team API
router.post("/create-team", async (req, res) => {
    try {
        const { teamName, members } = req.body;

        if (!teamName || members.length === 0) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // ✅ Generate Invite Token
        const inviteToken = Math.random().toString(36).substring(2, 15);
        const newTeam = new Team({
            name: teamName,
            inviteToken,
            members
        });

        await newTeam.save();
        res.status(201).json({
            message: "✅ Team created successfully",
            inviteLink: `http://localhost:5000/join?team=${teamName}&token=${inviteToken}`
        });

    } catch (error) {
        res.status(500).json({ error: "❌ Server error: " + error.message });
    }
});

// ✅ Join Team API
router.post("/join-team", async (req, res) => {
    try {
        const { teamName, inviteToken, userId } = req.body;

        // ✅ Find team by name and token
        const team = await Team.findOne({ name: teamName, inviteToken });

        if (!team) {
            return res.status(404).json({ error: "❌ Invalid invite link" });
        }

        // ✅ Check if user already joined
        const alreadyJoined = team.members.some(member => member.email === userId);
        if (!alreadyJoined) {
            team.members.push({ name: "New User", email: userId });
            await team.save();
        }

        res.status(200).json({ message: "✅ Successfully joined the team!" });
    } catch (error) {
        res.status(500).json({ error: "❌ Error joining team" });
    }
});

module.exports = router;
