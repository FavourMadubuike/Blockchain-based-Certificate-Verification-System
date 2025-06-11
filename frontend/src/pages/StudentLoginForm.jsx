import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentLoginForm = () => {
  const [jambNumber, setJambNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/recipients/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jambRegNumber: jambNumber, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-8 flex flex-col items-center">
        {/* Icon */}
        <div className="bg-green-800 rounded-full p-4 mb-4">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M2 7L12 12L22 7L12 2L2 7Z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12 12V22" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
            <path d="M7 16C7 16 7.5 18 12 18C16.5 18 17 16 17 16" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Text and Form */}
        <h2 className="text-2xl font-bold mb-1 text-center">Student Portal</h2>
        <p className="text-gray-600 mb-6 text-center">Access your certificates</p>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form className="w-full" onSubmit={handleSubmit}>
          <label className="font-semibold mb-2 block">JAMB Registration Number</label>
          <div className="relative mb-3">
            <span className="absolute left-3 top-2 text-gray-400">#</span>
            <input
              value={jambNumber}
              onChange={(e) => setJambNumber(e.target.value)}
              required
              className="border rounded-lg w-full pl-7 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Enter JAMB number"
            />
          </div>
          <label className="font-semibold mb-2 block">Password</label>
          <div className="relative mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border rounded-lg w-full pl-3 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Enter password"
            />
          </div>
          <p className="text-sm text-gray-500 mb-4">Enter your JAMB registration number and password</p>
          <button
            type="submit"
            className="bg-green-800 text-white w-full rounded-md py-2 font-semibold hover:bg-green-700 transition"
          >
            Access My Certificates
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-green-600 hover:underline mt-2"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default StudentLoginForm;