const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
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