const express = require('express');
const router = express.Router();
const Hackathon = require('../models/hackorg');

// ✅ Create Hackathon
router.post('/create', async (req, res) => {
  try {
    const newHackathon = new Hackathon(req.body);
    await newHackathon.save();
    res.status(201).json({ message: 'Hackathon Created Successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to Create Hackathon', error });
  }
});

// ✅ Get All Hackathons
router.get('/all', async (req, res) => {
  try {
    const hackathons = await Hackathon.find();
    res.status(200).json(hackathons);
  } catch (error) {
    res.status(500).json({ message: 'Failed to Fetch Hackathons', error });
  }
});




// ✅ Create Hackathon
router.post('/create', async (req, res) => {
  try {
    const newHackathon = new Hackathon(req.body);
    await newHackathon.save();
    res.status(201).json({ message: 'Hackathon Created Successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to Create Hackathon', error });
  }
});






// ✅ Get Hackathon by ID
router.get('/:id', async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon Not Found' });
    }
    res.status(200).json(hackathon);
  } catch (error) {
    res.status(500).json({ message: 'Failed to Fetch Hackathon', error });
  }
});

module.exports = router;
