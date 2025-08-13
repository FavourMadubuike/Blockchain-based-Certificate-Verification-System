const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');

const app = express();
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
require("dotenv").config();


// Configure CORS
app.use(cors({
  origin: 'http://localhost:5174',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Configure body-parser for JSON and URL-encoded data
app.use(bodyParser.json({ limit: '15mb' })); // Increase limit for JSON payloads
app.use(bodyParser.urlencoded({ extended: true, limit: '15mb' })); // Increase limit for URL-encoded

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Bockchain-Certificate-Verification-System', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Routes
const issuerRoutes = require("./routes/Issuer");
const verifierRoutes = require("./routes/Verifier");
const recipientRoutes = require("./routes/recipient");
app.use("/api/issuers", issuerRoutes);
app.use("/api/verifiers", verifierRoutes);
app.use("/api/recipients", recipientRoutes);

app.get("/", (req, res) => res.send("Blockchain-based Certificate Verification System API"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
