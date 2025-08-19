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
                            <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
                                <rect x="2" y="5" width="16" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.5" />
                                <path d="M2 5l8 6 8-6" stroke="#9ca3af" strokeWidth="1.5" />
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

                    <button onClick={() => navigate("/verifier-dashboard") } type="submit" className="bg-teal-600 w-full rounded-md text-white py-2 font-semibold hover:bg-teal-700 transition mb-3">Login to Verify</button>
                </form>

                <div className="w-full flex items-center my-3">
                    <div className="border-t border-gray-300 flex-grow"></div>
                    <span className="text-sm text-gray-400 mx-2">OR CONTINUE WITH</span>
                    <div className="border-t border-gray-300 flex-grow"></div>
                </div>

                {/* Google login */}
                <button className="flex items-center justify-center gap-2 border border-gray-300 w-full rounded-md py-2 hover:bg-gray-50 transition">
                    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                        <g>
                            <path d="M19.6 10.23c0-.68-.06-1.36-.17-2H10v3.79h5.5c-.24 1.26-.97 2.33-2.06 3.05v2.54h3.34c1.96-1.8 3.09-4.46 3.09-7.38z" fill="#4285F4" />
                            <path d="M10 20c2.7 0 4.97-.89 6.62-2.42l-3.34-2.54c-.92.61-2.09.98-3.29.98-2.53 0-4.67-1.71-5.43-4.01H1.11v2.6C2.82 17.98 6.13 20 10 20z" fill="#34A853" />
                            <path d="M4.57 11.99c-.21-.61-.33-1.25-.33-1.99s.12-1.38.33-1.99v-2.6H1.11A9.97 9.97 0 0 0 0 10c0 1.58.38 3.07 1.11 4.39l3.46-2.6z" fill="#FBBC05" />
                            <path d="M10 4c1.47 0 2.79.51 3.83 1.53l2.87-2.87C14.96 1.11 12.7 0 10 0 6.13 0 2.82 2.02 1.11 5.61l3.46 2.6C5.33 5.71 7.47 4 10 4z" fill="#EA4335" />
                            <path d="M0 0h20v20H0z" fill="none" />
                        </g>
                    </svg>
                    <span className="font-medium text-gray-700 text-sm">Continue with Google</span>
                </button>

                <button className="text-center mt-3 text-green-600 hover:text-green-500" type="button" onClick={() => navigate("/verifier-signup")}> Don't have an account? Sign Up</button>

                <button className="text-teal-700 text-sm hover:underline mt-2" type="button" onClick={() => navigate("/")}>Back to Home</button>
            </div>
        </div>
    )
};
export default VerifierLoginForm;