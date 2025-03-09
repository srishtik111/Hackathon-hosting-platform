const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    org_name: {
        type: String,
        required: true
    },
    contact_person: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    website: {
        type: String
    }
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;

