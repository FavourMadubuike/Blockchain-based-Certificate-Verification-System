const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateID: { type: String, required: true, unique: true },
  recipientID: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipient', required: true },
  issuerID: { type: String, required: true },
  program: { type: String, required: true },
  graduationDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'revoked', 'pending'], default: 'active' },
  certificateHash: { type: String, required: true },
  fileBuffer: { type: Buffer }, // Optional: for backward compatibility or small files
  filePath: { type: String },   // e.g., "/Uploads/CERT-123.pdf"
  fileType: { type: String },   // e.g., "pdf"
  transactionHash: { type: String, required: true }, // Added to store blockchain transaction hash
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Certificate', certificateSchema);