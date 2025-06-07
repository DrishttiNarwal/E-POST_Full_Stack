const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true }, 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "staff", "transport", "admin"], default: "staff" },
    trackingIDs: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
}, { collection: "User" });

module.exports = mongoose.model("User", userSchema);
