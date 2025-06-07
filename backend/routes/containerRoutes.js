const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const Container = require("../models/Container");
const Parcel = require("../models/Parcels");
const qr = require("qr-image");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const qrDir = path.join(__dirname, "../qrcodes/containers");

// Ensure QR code directory exists
if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir, { recursive: true }); // ✅ Create parent folders if missing
  }

// Create Container (Staff) ----------------------------------------------------------------
router.post("/", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "staff" ) {
      return res.status(403).json({ message: "Access Denied" });
    }

    const { parcels, destination, location } = req.body;

    // Check if all parcels exist
    const existingParcels = await Parcel.find({ trackingId: { $in: parcels } });
    if (existingParcels.length !== parcels.length) {
      return res.status(400).json({ message: "One or more parcels not found" });
    }

    const containerId = `CT-${Date.now()}`;

    // Generate QR Code for the container
    const qrCodePath = path.join(qrDir, `${containerId}.png`);
    const qr_svg = qr.image(containerId, { type: "png" });
    qr_svg.pipe(fs.createWriteStream(qrCodePath));

    const newContainer = new Container({
      containerId,
      parcels,
      destination,
      qrCode: qrCodePath,
      logs: [{ location, timestamp: Date.now() }],
      status: "in-transit",
      updatedAt: Date.now()
    });

    await newContainer.save();
    res.status(201).json({ message: "Container created", containerId, qrCodePath });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update COntainer (staff/ Transport)
router.put("/update/:containerId", authenticateUser, async (req, res) => {
    try {
      if (req.user.role !== "staff" && req.user.role !== "transport") {
        return res.status(403).json({ message: "Access Denied" });
      }
  
      const { location } = req.body;
      const { containerId } = req.params;
  
      const container = await Container.findOne({ containerId });
      if (!container) return res.status(404).json({ message: "Container not found" });
  
      // Update container logs
      container.logs.push({ location, timestamp: Date.now() });
      await container.save();
  
      // Update all parcels in the container
      await Parcel.updateMany(
        { trackingId: { $in: container.parcels } },
        { $push: { logs: { location, timestamp: Date.now() } } }
      );
  
      res.json({ message: "Container and parcels updated", container });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  
// Track Containers (admin) ---------------------------------------------------------------
router.get("/track/:containerId", async (req, res) => {
try {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access Denied" });
      }
    const { containerId } = req.params;
    const container = await Container.findOne({ containerId });

    if (!container) return res.status(404).json({ message: "Container not found" });

    res.json(container);
} catch (error) {
    res.status(500).json({ message: "Server error", error });
}
});
  

module.exports = router;
