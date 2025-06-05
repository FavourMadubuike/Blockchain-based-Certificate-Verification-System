const mongoose = require("mongoose");

const issuerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  senateRole: { type: String, required: true },
  role: { type: String, default: "issuer" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Issuer", issuerSchema);