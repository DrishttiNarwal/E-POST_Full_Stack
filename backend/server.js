const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const parcelRoutes = require("./routes/parcelRoutes");
app.use("/api/parcels", parcelRoutes);

const containerRoutes = require("./routes/containerRoutes");
app.use("/api/containers", containerRoutes);

// In your Express server.js
app.use('/qrcodes/parcels', express.static(path.join(__dirname, 'qrcodes/parcels')));


// Basic Route
app.get("/", (req, res) => {
  res.send("Postal System API");
});

const PORT = process.env.PORT || 5000;
console.log()
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

