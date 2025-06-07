const mongoose = require("mongoose")

const containerSchema = new mongoose.Schema({
    containerId: { type: String, required: true, unique: true },
    parcels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Parcel" }],
    destination: { type: String, required: true },
    qrCode: { type: String },
    logs: [
      {
        location: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, enum: ["in-transit", "delivered"], default: "in-transit" },
    updatedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model("Container", containerSchema);