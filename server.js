const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const teamRoutes = require("./routes/teamRoutes"); 
const participantRoutes = require('./routes/ParticipationRoutes');
const organizerRoutes = require('./routes/organizerRoutes');
const hackorgRoutes = require('./routes/hackorgRoutes');
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

connectDB();

// ✅ Serve Static Files
app.use('/uploads', express.static('uploads'));
app.use("/api/teams", teamRoutes);
app.use("/", userRoutes);
app.use("/api/participants", participantRoutes);
app.use('/api/organizers', organizerRoutes);
app.use('/api/hackathons', hackorgRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
