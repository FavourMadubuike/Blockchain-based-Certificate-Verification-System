const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  certificateID: { type: String, required: true, unique: true },
  recipientID: { type: mongoose.Schema.Types.ObjectId, ref: "Recipient", required: true },
  program: { type: String, required: true },
  graduationDate: { type: Date, required: true },
  status: { type: String, default: "pending" },
  certificateHash: { type: String },
  fileBuffer: { type: Buffer }, // Store PDF as binary
});

module.exports = mongoose.model("Certificate", certificateSchema);