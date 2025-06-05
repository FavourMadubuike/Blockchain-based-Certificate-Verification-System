import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SenateLoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-8 flex flex-col items-center">
                {/* Icon */}
                <div className="bg-green-800 rounded-full p-4 mb-4">
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                        <path d="M12 3L4 6V11C4 16.25 12 21 12 21C12 21 20 16.25 20 11V6L12 3Z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" fill="white" />
                    </svg>
                </div>

                {/* Text and Form */}
                <h2 className="text-2xl font-bold mb-1 text-center">Senate Portal</h2>
                <p className="text-gray-600 mb-6 text-center">Upload and manage student certificates</p>
                <form className="w-full" onSubmit={handleSubmit}>
                    <label className="font-semibold mb-2 block">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required
                        className="border rounded-lg w-full px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-200"
                    />

                    <label className="font-semibold mb-2 block">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required
                        className="border rounded-lg w-full px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-200"
                    />

                    <button type="submit" className="bg-green-800 text-white w-full rounded-md py-2 font-semibold hover:bg-green-700 transition">Login to Senate Portal</button>
                </form>

                <button type="button" onClick={() => navigate("/")} className="text-green-600 hover:underline mt-2">Back to Home</button>
            </div>
        </div>
    )
};
export default SenateLoginForm;
