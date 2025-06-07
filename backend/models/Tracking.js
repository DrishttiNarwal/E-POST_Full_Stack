const mongoose = require("mongoose");

const trackingLogSchema = new mongoose.Schema({
    parcelId: {type: String, required: true},
    status: { type: String, required: true },
    location: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model("TrackingLog", trackingLogSchema);