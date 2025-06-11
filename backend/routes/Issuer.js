const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Issuer = require("../models/Issuer");
const Certificate = require("../models/certificate");
const router = express.Router();

// Middleware to verify issuer JWT
const verifyIssuer = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    if (decoded.role !== "issuer") {
      return res.status(403).json({ message: "Access denied: issuer role required" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// Issuer Login
router.post("/login", async (req, res) => {
  console.log("POST /api/issuer/login hit", req.body);
  const { username, password } = req.body;
  try {
    const issuer = await Issuer.findOne({ username });
    console.log("Issuer found:", issuer ? issuer.username : "None");
    if (!issuer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, issuer.password);
    console.log("Password match:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: issuer._id, role: issuer.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );
    console.log("Token generated for:", issuer.username);
    res.status(200).json({
      token,
      user: {
        id: issuer._id,
        username: issuer.username,
        name: issuer.name,
        email: issuer.email,
        role: issuer.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get Issuer Profile
router.get("/profile", verifyIssuer, async (req, res) => {
  try {
    const issuer = await Issuer.findById(req.user.id).select("name username email role createdAt");
    if (!issuer) {
      return res.status(404).json({ message: "Issuer not found" });
    }
    res.status(200).json({
      name: issuer.name,
      username: issuer.username,
      email: issuer.email,
      role: issuer.role,
      createdAt: issuer.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update Issuer Profile
router.post("/update-profile", verifyIssuer, async (req, res) => {
  const { name, username, password, email } = req.body;
  try {
    const issuer = await Issuer.findById(req.user.id);
    if (!issuer) {
      return res.status(404).json({ message: "Issuer not found" });
    }

    if (name) {
      issuer.name = name;
    }

    if (username) {
      const existingUsername = await Issuer.findOne({ username });
      if (existingUsername && existingUsername._id.toString() !== req.user.id) {
        return res.status(400).json({ message: "Username already taken" });
      }
      issuer.username = username;
    }

    if (email) {
      const existingEmail = await Issuer.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== req.user.id) {
        return res.status(400).json({ message: "Email already taken" });
      }
      issuer.email = email;
    }

    if (password) {
      issuer.password = await bcrypt.hash(password, 10);
    }

    await issuer.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get Certificates
router.get("/certificates", verifyIssuer, async (req, res) => {
  try {
    const certificates = await Certificate.find();
    const formattedCertificates = certificates.map((cert) => ({
      certificateID: cert.certificateID,
      program: cert.program,
      issueDate: cert.graduationDate,
      status: cert.status,
      issuer: "Federal University of Technology Owerri",
      type: cert.program.includes("Bachelor") ? "Degree Certificate" : "Professional Certificate",
      certificateHash: cert.certificateHash,
    }));
    res.status(200).json(formattedCertificates);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;