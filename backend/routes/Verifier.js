const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const ethers = require("ethers");
const CertificateManagerABI = require("../contracts/CertificateManagerABI.json");
const Verifier = require("../models/Verifier");
const Certificate = require("../models/Certificate");
const Recipient = require("../models/Recipient");
const Issuer = require("../models/Issuer");
const router = express.Router();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  pool: true,
  maxConnections: 5,
  rateLimit: 10,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer configuration error:", error);
  } else {
    console.log("Nodemailer is ready to send emails");
  }
});

// Middleware to verify verifier JWT
const verifyVerifier = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    if (decoded.role !== "verifier") {
      console.log("Access denied: verifier role required");
      return res.status(403).json({ message: "Access denied: verifier role required" });
    }
    req.user = { id: decoded.id.toString(), role: decoded.role };
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// Verifier Signup
router.post("/signup", async (req, res) => {
  const { name, email, password, organization } = req.body;
  try {
    let verifier = await Verifier.findOne({ email });
    if (verifier) {
      console.log("Email already exists:", email);
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = Math.random().toString(36).substring(2);
    verifier = new Verifier({
      name,
      email,
      password: hashedPassword,
      organization,
      verificationToken,
      verificationTokenExpires: Date.now() + 3600000,
    });
    await verifier.save();

    const verificationUrl = `${process.env.BACKEND_URL}/api/verifiers/verify/${verificationToken}`;
    try {
      await transporter.sendMail({
        from: `"FUTO Certificate System" <${process.env.EMAIL_USERNAME}>`,
        to: email,
        subject: "Verify Your Account",
        text: `Hello ${name},\n\nPlease verify your account by clicking: ${verificationUrl}\n\nThis link expires in 1 hour.`,
        html: `
          <h2>Verify Your Account</h2>
          <p>Hello ${name},</p>
          <p>Please verify your account by clicking the link below:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #0d9488; text-decoration: none; border-radius: 5px;">Verify Email</a>
          <p>This link expires in 1 hour.</p>
        `,
      });
      console.log("Verification email sent to:", email);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return res.status(500).json({ message: "Failed to send verification email", error: emailError.message });
    }

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
      console.log("Invalid or expired token:", token);
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    verifier.isVerified = true;
    verifier.verificationToken = undefined;
    verifier.verificationTokenExpires = undefined;
    await verifier.save();
    console.log("Email verified for:", verifier.email);
    res.redirect(`${process.env.CLIENT_URL}/verifier-login`);
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
      console.log("Invalid credentials for email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!verifier.isVerified) {
      console.log("Email not verified for:", email);
      return res.status(401).json({ message: "Please verify your email first" });
    }
    const isMatch = await bcrypt.compare(password, verifier.password);
    if (!isMatch) {
      console.log("Password mismatch for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
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

// Sepolia blockchain setup
const provider = new ethers.JsonRpcProvider(
  process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"
);
const wallet = process.env.PRIVATE_KEY
  ? new ethers.Wallet(process.env.PRIVATE_KEY, provider)
  : null;
const contract = process.env.CONTRACT_ADDRESS && wallet
  ? new ethers.Contract(process.env.CONTRACT_ADDRESS, CertificateManagerABI, wallet)
  : null;

// Validate blockchain configuration
const validateBlockchainConfig = (res) => {
  if (!process.env.SEPOLIA_RPC_URL) {
    res.status(500).json({ message: "Server error: SEPOLIA_RPC_URL not configured" });
    return false;
  }
  if (!process.env.PRIVATE_KEY) {
    res.status(500).json({ message: "Server error: PRIVATE_KEY not configured" });
    return false;
  }
  if (!process.env.CONTRACT_ADDRESS) {
    res.status(500).json({ message: "Server error: CONTRACT_ADDRESS not configured" });
    return false;
  }
  if (!wallet || !contract) {
    res.status(500).json({ message: "Server error: Blockchain contract not initialized" });
    return false;
  }
  return true;
};

// Verify Certificates
router.post("/verify", verifyVerifier, async (req, res) => {
  const { searchTerm } = req.body;

  if (!searchTerm) {
    console.log("Missing search term");
    return res.status(400).json({ message: "Search term is required" });
  }

  try {
    const certificates = await Certificate.find({
      $or: [
        { certificateID: searchTerm },
        { recipientID: await Recipient.findOne({ name: { $regex: searchTerm, $options: "i" } }).select("_id") },
        { recipientID: await Recipient.findOne({ jambRegNumber: searchTerm }).select("_id") },
      ],
    }).populate("recipientID", "name jambRegNumber").select("certificateID recipientID program graduationDate status certificateHash filePath fileType issuerID");

    if (certificates.length === 0) {
      console.log("No certificates found for search term:", searchTerm);
      return res.status(404).json({ message: "No certificates found" });
    }

    // Fetch issuer names
    const issuerIds = [...new Set(certificates.map(c => c.issuerID))];
    const issuers = await Issuer.find({ _id: { $in: issuerIds.map(id => mongoose.Types.ObjectId.createFromHexString(id)) } }).select('name');
    const issuerMap = new Map(issuers.map(i => [i._id.toString(), i.name]));

    const results = await Promise.all(
      certificates.map(async (cert) => {
        if (!validateBlockchainConfig(res)) return null;

        try {
          if (!cert.certificateHash || !cert.certificateID) {
            return {
              id: cert.certificateID || "Unknown",
              recipientName: cert.recipientID?.name || "Unknown",
              jambNumber: cert.recipientID?.jambRegNumber || "Unknown",
              program: cert.program || "Unknown",
              graduationDate: cert.graduationDate || null,
              issuer: issuerMap.get(cert.issuerID) || "Unknown",
              status: "invalid",
              reason: "Missing certificate hash or ID",
              filePath: cert.filePath || null,
              fileType: cert.fileType || null,
            };
          }

          const certificateIdBytes32 = ethers.id(cert.certificateID);
          const [onChainHash, jambRegNumber, program, issueDate, issuerAddress, isValid] = await contract.verifyCertificate(
            certificateIdBytes32
          );

          const certHashBytes = ethers.getBytes(cert.certificateHash);
          const isHashMatch = onChainHash === ethers.hexlify(certHashBytes);
          const status = isValid && isHashMatch && cert.status === "active" ? "valid" : "invalid";
          const reason = !isValid ? "Revoked" : !isHashMatch ? "Hash mismatch" : cert.status !== "active" ? cert.status : null;

          return {
            id: cert.certificateID,
            recipientName: cert.recipientID?.name || "Unknown",
            jambNumber: cert.recipientID?.jambRegNumber || "Unknown",
            program: cert.program,
            graduationDate: cert.graduationDate,
            issuer: issuerMap.get(cert.issuerID) || "Unknown",
            status,
            reason,
            filePath: cert.filePath || null,
            fileType: cert.fileType || null,
          };
        } catch (err) {
          console.error("Blockchain verification error for certificate:", cert.certificateID, err);
          return {
            id: cert.certificateID || "Unknown",
            recipientName: cert.recipientID?.name || "Unknown",
            jambNumber: cert.recipientID?.jambRegNumber || "Unknown",
            program: cert.program || "Unknown",
            graduationDate: cert.graduationDate || null,
            issuer: issuerMap.get(cert.issuerID) || "Unknown",
            status: "invalid",
            reason: `Blockchain verification failed: ${err.message}`,
            filePath: cert.filePath || null,
            fileType: cert.fileType || null,
          };
        }
      })
    );

    const validResults = results.filter((result) => result !== null);
    console.log("Verification results:", validResults);

    res.status(200).json(validResults);
  } catch (err) {
    console.error("Server error in /verify:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get Verifier Profile
router.get("/profile", verifyVerifier, async (req, res) => {
  try {
    const verifier = await Verifier.findById(req.user.id).select("name email organization");
    if (!verifier) {
      console.log("Verifier not found for ID:", req.user.id);
      return res.status(404).json({ message: "Verifier not found" });
    }
    res.status(200).json({
      name: verifier.name,
      email: verifier.email,
      organization: verifier.organization || "",
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update Verifier Profile
router.put("/profile", verifyVerifier, async (req, res) => {
  const { name, email, organization } = req.body;

  if (!name || !email) {
    console.log("Missing required fields:", { name, email });
    return res.status(400).json({ message: "Name and email are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log("Invalid email format:", email);
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existingVerifier = await Verifier.findOne({ email, _id: { $ne: req.user.id } });
    if (existingVerifier) {
      console.log("Email already in use:", email);
      return res.status(400).json({ message: "Email already in use" });
    }

    const verifier = await Verifier.findByIdAndUpdate(
      req.user.id,
      { name, email, organization: organization || "" },
      { new: true }
    );

    if (!verifier) {
      console.log("Verifier not found for ID:", req.user.id);
      return res.status(404).json({ message: "Verifier not found" });
    }

    console.log("Profile updated for verifier:", req.user.id);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update Verifier Password
router.put("/profile/password", verifyVerifier, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    console.log("Missing password fields");
    return res.status(400).json({ message: "Current and new passwords are required" });
  }

  if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    console.log("Invalid new password format");
    return res.status(400).json({ message: "New password must be at least 8 characters and include letters and numbers" });
  }

  try {
    const verifier = await Verifier.findById(req.user.id);
    if (!verifier) {
      console.log("Verifier not found for ID:", req.user.id);
      return res.status(404).json({ message: "Verifier not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, verifier.password);
    if (!isMatch) {
      console.log("Incorrect current password");
      return res.status(401).json({ message: "Incorrect current password" });
    }

    verifier.password = await bcrypt.hash(newPassword, 12);
    await verifier.save();

    console.log("Password updated for verifier:", req.user.id);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;