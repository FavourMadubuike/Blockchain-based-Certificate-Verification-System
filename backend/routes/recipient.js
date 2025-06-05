const express = require("express");
const fs = require("fs").promises;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Recipient = require("../models/Recipient");
const router = express.Router();

// Middleware to verify issuer (Senate) JWT
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

// Import student data from JSON
router.post("/import", verifyIssuer, async (req, res) => {
  try {
    const data = await fs.readFile("./admission_list.json", "utf-8");
    const students = JSON.parse(data);

    const recipients = await Promise.all(
      students.map(async (student) => ({
        generalSerialNumber: student.general_serial_number,
        departmentSerialNumber: student.department_serial_number,
        name: student.fullname,
        jambRegNumber: student.jamb_reg_number,
        password: await bcrypt.hash(student.jamb_reg_number, 10),
        gender: student.gender,
        state: student.state,
        lga: student.lga,
        modeOfAdmission: student.mode_of_admission,
        program: student.programme,
        role: "recipient",
        createdAt: new Date(),
      }))
    );

    const result = await Recipient.insertMany(recipients, { ordered: false });
    res.status(201).json({
      message: `Inserted ${result.length} recipient records into MongoDB`,
    });
  } catch (err) {
    console.error("Import error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Student Login
router.post("/login", async (req, res) => {
  const { jambRegNumber, password } = req.body;
  try {
    const recipient = await Recipient.findOne({ jambRegNumber });
    if (!recipient) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, recipient.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!process.env.JWT_SECRET) {
      console.warn("JWT_SECRET is not set in environment variables");
    }
    const token = jwt.sign(
      { id: recipient._id, role: recipient.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );
    res.status(201).json({
      token,
      user: { id: recipient._id, name: recipient.name, role: recipient.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;