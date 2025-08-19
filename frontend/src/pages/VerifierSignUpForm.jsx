import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifierSignUpForm = () => {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        organization: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = e => {
        e.preventDefault();

        const passwordRequirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRequirements.test(form.password)) {
            setError("Password must be at least 8 characters include uppercase, lowercase, number, and special character. ");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match. ");
            return;
        }

        // On sucess, navigate to login
        navigate("/verifier-login");
    };

    return (
        <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl flex flex-col items-center p-8 my-32">
                {/* Icon */}
                <div className="bg-green-500 rounded-full p-4 mb-4">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="12" fill="#bbf7d0" />
                        <path d="M8 12.5l2.5 2.5L16 9" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                </div>

                {/* Title + Text */}
                <h2 className="text-2xl font-bold mb-1 text-center">Verifier Portal</h2>
                <p className="text-gray-600 text-center mb-6">Create your verifier account</p>

                <form className="w-full" onSubmit={handleSubmit}>
                    <div className="flex gap-3 mb-4">
                        <div className="w-1/2">
                            <label className="font-semibold mb-2 block">First Name</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                                        <path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 18a8 8 0 0 1 16 0" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </span>
                                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" required
                                    className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
                                />
                            </div>
                        </div>

                        <div className="w-1/2">
                            <label className="font-semibold mb-2 block">Last Name</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                                        <path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 18a8 8 0 0 1 16 0" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </span>
                                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" required
                                    className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
                                />
                            </div>
                        </div>
                    </div>

                    <label className="font-semibold mb-2 block">Organization</label>
                    <div className="relative mb-4">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
                                <rect x="3" y="7" width="14" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.5" />
                                <path d="M8 17v-4h4v4" stroke="#9ca3af" strokeWidth="1.5" />
                            </svg>
                        </span>
                        <input type="text" name="organization" value={form.organization} onChange={handleChange} placeholder="Your Organization" required
                            className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
                        />
                    </div>

                    <label className="font-semibold mb-2 block">Email Address</label>
                    <div className="relative mb-4">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
                                    <rect x="2" y="5" width="16" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.5" />
                                    <path d="M2 5l8 6 8-6" stroke="#9ca3af" strokeWidth="1.5" />
                                </svg>
                            </span>
                            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required
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
                        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" required
                            className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
                        />
                    </div>

                    <label className="font-semibold mb-2 block">Confirm Password</label>
                    <div className="relative mb-4">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                <path d="M7 11V7a5 5 0 1 1 10 0v4" stroke="#a3a3a3" strokeWidth="1.5" />
                                <rect x="5" y="11" width="14" height="8" rx="2" stroke="#a3a3a3" strokeWidth="1.5" />
                            </svg>
                        </span>
                        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm your password" required
                            className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
                        />
                    </div>

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <button className="w-full bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-2 rounded-md mt-2 shadow-sm" type="submit">Create Account</button>
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
                    <span className="font-medium text-gray-700 text-sm">Sign up with Google</span>
                </button>

                <div className="text-center text-sm mt-2">
                    <span className="text-gray-600">Already have an account? </span>
                    <button type="button" className="text-green-600 font-medium hover:underline"
                        onClick={() => navigate("/verifier-login")}>Login
                    </button>
                </div>

                <button className="text-teal-700 text-sm hover:underline mt-2" type="button" onClick={() => navigate("/")}>Back to Home</button>
            </div>
        </div>
    )
};

export default VerifierSignUpForm;