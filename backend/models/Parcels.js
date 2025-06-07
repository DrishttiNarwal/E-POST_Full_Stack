const mongoose = require("mongoose");
// const { create } = require("./Tracking");

const parcelSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sender: { 
    address: { type: String, required: true },
    pin: { type: String, required: true }
  },
  receiver: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
  },
  location: { type: String, required: true },
  status: { type: String, enum: ["pending", "in-transit", "delivered"], default: "pending" },
  containerId: { type: mongoose.Schema.Types.ObjectId, ref: "Container", default: null },
  createdAt: { type: Date, default: Date.now }
});


  module.exports = mongoose.model("Parcel", parcelSchema);

