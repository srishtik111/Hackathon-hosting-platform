const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes"); 
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use("/", userRoutes);
app.use("/", teamRoutes); // Use team routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
