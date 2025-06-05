const mongoose = require("mongoose");

const recipientSchema = new mongoose.Schema({
  generalSerialNumber: { type: String, required: true },
  departmentSerialNumber: { type: String, required: true },
  name: { type: String, required: true },
  jambRegNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  state: { type: String, required: true },
  lga: { type: String, required: true },
  modeOfAdmission: { type: String, required: true },
  program: { type: String, required: true },
  role: { type: String, default: "recipient" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recipient", recipientSchema);