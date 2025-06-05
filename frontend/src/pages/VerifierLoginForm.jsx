import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifierLoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl flex flex-col items-center p-8">
                {/* icon */}
                <div className="bg-teal-600 rounded-full p-4 mb-4">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" />
                        <path d="M8 13l2.5 2.5L16 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                {/* Text and Form */}
                <h2 className="text-2xl font-bold mb-1 text-center">Verifier Portal</h2>
                <p className="text-gray-600 text-center mb-6">Verify FUTO student certificates</p>
                <form className="w-full" onSubmit={handleSubmit}>
                    <label className="font-semibold mb-2 block">Email Address</label>
                    <div className="relative mb-4">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                <path d="M4 4h16v16H4V4zm2 2v2h12V6H6zm0 4v8h12v-8H6z" stroke="#a3a3a3" strokeWidth="1.5" />
                            </svg>
                        </span>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required
                            className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
                        />
                    </div>

                    <label className="font-semibold mb-2 block">Password</label>
                    <div className="relative mb-4">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                <path d="M7 11V7a5 5 0 1 1 10 0v4" stroke="#a3a3a3" strokeWidth="1.5" />
                                <rect x="5" y="11" width="14" height="8" rx="2" stroke="#a3a3a3" strokeWidth="1.5" />
                            </svg>
                        </span>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required
                            className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
                        />
                    </div>

                    <button type="submit" className="bg-teal-600 w-full rounded-md text-white py-2 font-semibold hover:bg-teal-700 transition mb-3">Login to Verify</button>
                </form>

                <div className="w-full flex items-center my-3">
                    <div className="border-t border-gray-300 flex-grow"></div>
                    <span className="text-sm text-gray-400 mx-2">OR CONTINUE WITH</span>
                    <div className="border-t border-gray-300 flex-grow"></div>
                </div>

                {/* Google login */}
                <button className="flex items-center justify-center border border-gray-300 w-full rounded-md py-2 font-semibold text-sm hover:bg-gray-50 transition">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="mr-2">
                        <g>
                            <path d="M21.805 10.023h-9.785v3.977h5.62c-.244 1.326-1.463 3.897-5.62 3.897-3.375 0-6.12-2.786-6.12-6.218a6.212 6.212 0 0 1 6.12-6.18c1.926 0 3.22.822 3.96 1.53l2.7-2.633c-1.71-1.582-3.93-2.554-6.66-2.554C5.1 2.842 0 7.229 0 12.68c0 5.453 5.1 9.84 10.89 9.84 6.33 0 10.51-4.441 10.51-10.715 0-.719-.08-1.263-.18-1.782z" fill="#4285F4" />
                            <path d="M2.832 6.684l3.075 2.259c.822-1.08 2.075-2.169 4.983-2.169 1.926 0 3.22.822 3.96 1.53l2.7-2.633c-1.71-1.582-3.93-2.554-6.66-2.554-3.285 0-6.077 1.725-7.8 4.547z" fill="#34A853" />
                            <path d="M10.89 22.52c2.64 0 5.16-.875 7.08-2.38l-3.274-2.694c-.91.657-2.13 1.122-3.806 1.122-3.09 0-5.7-2.017-6.638-4.748l-3.164 2.445c1.743 3.43 5.235 5.83 9.802 5.83z" fill="#FBBC05" />
                            <path d="M21.805 10.023h-9.785v3.977h5.62c-.244 1.326-1.463 3.897-5.62 3.897-3.375 0-6.12-2.786-6.12-6.218a6.212 6.212 0 0 1 6.12-6.18c1.926 0 3.22.822 3.96 1.53l2.7-2.633c-1.71-1.582-3.93-2.554-6.66-2.554C5.1 2.842 0 7.229 0 12.68c0 5.453 5.1 9.84 10.89 9.84 6.33 0 10.51-4.441 10.51-10.715 0-.719-.08-1.263-.18-1.782z" fill="none" />
                        </g>
                    </svg>
                    Continue with Google
                </button>

                <button className="text-teal-700 hover:underline mt-2" type="button" onClick={() => navigate("/")}>Back to Home</button>
            </div>
        </div>
    )
};
export default VerifierLoginForm;