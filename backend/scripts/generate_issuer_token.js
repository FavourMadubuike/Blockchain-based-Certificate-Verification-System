const jwt = require("jsonwebtoken");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const generateIssuerToken = () => {
  try {
    const secret = process.env.JWT_SECRET || "your_jwt_secret";
    const payload = {
      id: "issuer_test_id", // Replace with a valid issuer ID if needed
      role: "issuer",
    };
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    console.log("Issuer JWT Token:", `Bearer ${token}`);
  } catch (err) {
    console.error("Error generating token:", err.message);
  }
};

generateIssuerToken();