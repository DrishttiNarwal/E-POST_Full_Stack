const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const Parcel = require("../models/Parcels");
const TrackingLog = require("../models/Tracking");
const qr = require("qr-image");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const qrDir = path.join(__dirname, "../qrcodes/parcels");

// Ensure QR code directory exists
if (!fs.existsSync(qrDir)) {
  fs.mkdirSync(qrDir, { recursive: true }); 
}

// Get All Parcels (Admin Only)
// router.get("/", authenticateUser, async (req, res) => {
//   try {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access Denied" });
//     }

//     const parcels = await Parcel.find({});
//     res.json(parcels);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error Fetching Parcels", error });
//   }
// });

// Add Parcel (Staff Only)
router.post("/create", authenticateUser, async (req, res) => {
  try {
    // if (req.currentUser.role !== "staff") {
    //   return res.status(500).json({ message: "Access Denied" });
    // }

    const { sender, receiver, location } = req.body;
    const trackingId = `EPOST${Date.now()}`;

    // Generate QR Code
    const qrCodePath = path.join(qrDir, `${trackingId}.png`);
    const qr_svg = qr.image(trackingId, { type: "png" });
    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(qrCodePath);
      qr_svg.pipe(writeStream);
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    const newParcel = new Parcel({
      trackingId,
      sender,
      receiver,
      qrCode: qrCodePath,
      createdBy: req.currentUser._id,
      status: "pending",
      location: location
    });

    console.log(newParcel);
    await newParcel.save();

    // Create Initial Tracking Log
    await TrackingLog.create({
        _id: newParcel._id,
        parcelId: trackingId, 
        status: "pending",
        location: req.body.location,
    });

    res.status(201).json({
      message: "Parcel created",
      trackingId,
      qrCodePath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Get Users Parcels (Authenticated Users)
router.get("/getParcels", authenticateUser, async (req, res) => {
  try {
    const parcels = await Parcel.find({createdBy: req.currentUser._id}).sort({ createdAt: -1 });
    console.log(parcels);
    res.json(parcels);
  } catch (error) {                         
    console.error(error);
    res.status(500).json({ message: "Error Fetching Parcels", error });
  }
});

// Public Parcel Tracking (No Authentication)
router.get("/track/:trackingId", async (req, res) => {
  try {
    const parcel = await Parcel.findOne({ trackingId: req.params.trackingId });

    if (!parcel) {
      return res.status(404).json({ message: "Parcel not found" });
    }

    // Fetch Tracking History
    const trackingLogs = await TrackingLog.find({ parcelId: parcel._id }).sort({
      timestamp: 1,
    });
 
    res.json({ parcel, trackingLogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error tracking parcel", error });
  }
});

// Update Parcel Status and Location (Staff/Admin/Transport)
router.put("/update/:trackingId", authenticateUser, async (req, res) => {
  try {
    // if (
    //   req.user.role !== "staff" &&
    //   req.user.role !== "admin" &&
    //   req.user.role !== "transport"
    // ) {
    //   return res.status(403).json({ message: "Access Denied" });
    // }

    const { location, status } = req.body;
    const { trackingId } = req.params;

    const parcel = await Parcel.findOne({ trackingId });
    if (!parcel) return res.status(404).json({ message: "Parcel not found" });
    console.log(parcel);
    // Update Logs and Status
    if (status) parcel.status = status;
    parcel.location = location;

    const parcelRes  = await parcel.save();
    console.log(parcelRes);
    if (!parcelRes) return res.status(404).json({ message: "Parcel not updated" });

    // Add New Tracking Log
    const trackingRes = await TrackingLog.create({
      parcelId: trackingId,
      status: status || parcel.status,
      location,
    });

    console.log(trackingRes);
    if (!trackingRes) return res.status(404).json({ message: "Tracking Log not created" });

    res.json({ message: "Parcel updated", parcel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error?.response?.data });
  }
});

// Delete Parcel (Admin Only)
router.delete("/delete/:trackingId", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }

    const parcel = await Parcel.findOneAndDelete({
      trackingId: req.params.trackingId,
    });

    if (!parcel) {
      return res.status(404).json({ message: "Parcel not found" });
    }

    // Delete Related Tracking Logs
    await TrackingLog.deleteMany({ parcelId: parcel._id });

    res.json({ message: "Parcel deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting parcel", error });
  }
});

router.get("/inTransitCount", async (req, res) => {
    try {
      const inTransitCount = await Parcel.countDocuments({status: "in-transit"});
      res.status(200).json({ count: inTransitCount });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user count", error });
    }
  });

router.get("/count", async (req, res) => {
    try {
      const parcelCount = await Parcel.countDocuments({});
      res.status(200).json({ count: parcelCount });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user count", error });
    }
  });
module.exports = router;
