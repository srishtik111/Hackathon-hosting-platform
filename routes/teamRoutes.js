const express = require("express");
const router = express.Router();
const Team = require("../models/team");
const User = require("../models/user"); // Assuming you have a User model

// Create a team
router.post("/create-team", async (req, res) => {
  try {
      const { userId, name } = req.body;
      if (!userId) return res.status(401).json({ error: "You must be logged in to create a team." });

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found." });

      const inviteToken = Math.random().toString(36).substring(2, 15); // Generate token
      const newTeam = new Team({ name, inviteToken, members: [userId] });
      await newTeam.save();

      res.status(200).json({ message: "Team created successfully!", inviteLink: inviteToken });
  } catch (error) {
      res.status(500).json({ error: "Server error: " + error.message });
  }
});



// Join a team
router.post("/join-team", async (req, res) => {
  try {
    const { teamName, inviteToken, userId } = req.body;

    if (!teamName || !inviteToken || !userId) {
      return res.status(400).json({ error: "All fields required" });
    }

    const team = await Team.findOne({ name: teamName, inviteToken });

    if (!team) {
      return res.status(404).json({ error: "Invalid invite link" });
    }

    // Add user to the team if not already a member
    if (!team.members.includes(userId)) {
      team.members.push(userId);
      await team.save();
    }

    res.status(200).json({ message: "Joined team successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error joining team" });
  }
});

module.exports = router;
