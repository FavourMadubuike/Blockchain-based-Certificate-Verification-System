const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Verifier = require("../models/Verifier");
const router = express.Router();

// Email service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verifier Signup
router.post("/signup", async (req, res) => {
  const { name, email, password, organization } = req.body;
  try {
    let verifier = await Verifier.findOne({ email });
    if (verifier) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.random().toString(36).substring(2);
    verifier = new Verifier({
      name,
      email,
      password: hashedPassword,
      organization,
      verificationToken,
      verificationTokenExpires: Date.now() + 3600000, // 1 hour
    });
    await verifier.save();

    // Send verification email
    const verificationUrl = `${process.env.BACKEND_URL}/api/verifier/verify/${verificationToken}`;
    await transporter.sendMail({
      from: `FUTO Certificate System <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: "Verify Your Account",
      text: `Hello ${name},\n\nPlease verify your account by clicking: ${verificationUrl}\n\nThis link expires in 1 hour.`,
    });

    res.status(201).json({ message: "Account created. Please verify your email." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Verifier Email Verification
router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const verifier = await Verifier.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });
    if (!verifier) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    verifier.isVerified = true;
    verifier.verificationToken = undefined;
    verifier.verificationTokenExpires = undefined;
    await verifier.save();
    res.redirect(`${process.env.CLIENT_URL}/verifier/login`);
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Verifier Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const verifier = await Verifier.findOne({ email });
    if (!verifier) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!verifier.isVerified) {
      return res.status(401).json({ message: "Please verify your email first" });
    }
    const isMatch = await bcrypt.compare(password, verifier.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!process.env.JWT_SECRET) {
      console.warn("JWT_SECRET is not set in environment variables");
    }
    const token = jwt.sign(
      { id: verifier._id, role: verifier.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );
    res.json({
      token,
      user: { id: verifier._id, name: verifier.name, role: verifier.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;