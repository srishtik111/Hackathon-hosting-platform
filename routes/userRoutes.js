const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const router = express.Router();

// 🟢 SIGNUP Route (Includes userType)
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;

    if (!userType) {
      return res.status(400).json({ error: "User type is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      userType, // ✅ Only set here
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// 🔵 SIGNIN Route (❌ No userType)
// 🔵 SIGNIN Route (Modified to use email)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;  // ✅ Get email instead of username

    const user = await User.findOne({ email });  // ✅ Search by email
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Login successful!", 
      userId: user._id,  // ✅ Send userId
      email: user.email,  
      userType: user.userType  // ✅ Send userType
    });
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
});



module.exports = router;
