const express = require('express');
const Organization = require('../models/organizer');
const router = express.Router();

// POST request to create a new organization
router.post('/register', async (req, res) => {
    const { org_name, contact_person, email, phone, website } = req.body;

    try {
        // Check if the email already exists
        const existingOrg = await Organization.findOne({ email });
        if (existingOrg) {
            return res.status(400).json({ message: 'Organization with this email already exists.' });
        }

        // Create a new organization
        const newOrganization = new Organization({
            org_name,
            contact_person,
            email,
            phone,
            website
        });

        await newOrganization.save();
        res.status(201).json({ message: 'Organization registered successfully!' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// GET request to fetch all organizations
router.get('/all', async (req, res) => {
    try {
        const organizations = await Organization.find();
        res.status(200).json(organizations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;

