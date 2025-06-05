const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Issuer = require("../models/Issuer");
const router = express.Router();

// Seed predefined Senate accounts (run once)
const seedIssuers = async () => {
  const issuers = [
    {
      name: "Prof. (Mrs.) U. F. Eze",
      username: "prof eze",
      password: await bcrypt.hash("senate123", 10),
      email: "eze.f.@futo.edu.ng",
      department: "Information Technology",
      senateRole: "Dean",
      role: "issuer",
    },
    {
      name: "Prof. Ada Eze",
      username: "ada.eze",
      password: await bcrypt.hash("senate456", 10),
      email: "ada.eze@futo.edu.ng",
      department: "Electrical Engineering",
      senateRole: "Registrar",
      role: "issuer",
    },
    {
      name: "Mr. Chidi Nwankwo",
      username: "chidi.nwankwo",
      password: await bcrypt.hash("senate789", 10),
      email: "chidi.nwankwo@futo.edu.ng",
      department: "Mechanical Engineering",
      senateRole: "Secretary",
      role: "issuer",
    },
  ];

  const existing = await Issuer.countDocuments();
  if (existing === 0) {
    await Issuer.insertMany(issuers);
    console.log("Seeded 3 Senate accounts");
  }
};
seedIssuers();

// Issuer Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const issuer = await Issuer.findOne({ username });
    if (!issuer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, issuer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: issuer._id, role: issuer.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );
    res.json({
      token,
      user: { id: issuer._id, name: issuer.name, role: issuer.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;