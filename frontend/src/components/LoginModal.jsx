import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ROLES = [
    {
        key: "Student",
        color: "hover:border-green-500",
        iconBg: "bg-green-100",
        iconStroke: "#16A34A",
        name: "Student",
        desc: "Access your certificates",
        path: "/student-login"
    },

    {
        key: "Senate",
        color: "hover:border-green-500",
        iconBg: "bg-blue-100",
        iconStroke: "#3B82F6",
        name: "Senate",
        desc: "Upload student certificates",
        path: "/senate-login"
    },

    {
        key: "Verifier",
        color: "hover:border-green-500",
        iconBg: "bg-purple-100",
        iconStroke: "#A78BFA",
        name: "Verifier",
        desc: "Verify certificates",
        path: "/verifier-login"
    },
];

const LoginModal = ({ open, onClose }) => {
    const navigate = useNavigate();

    if (!open) return null;

    return (
        <div className="bg-black bg-opacity-40 fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl w-[90vw] max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
                {/* Close button */}
                <button className="absolute top-4 right-4 text-gray-500 hover:bg-gray-100 rounded-full border border-gray-300 p-1" onClick={onClose} aria-label="Close">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                        <path d="M6 6l12 12M6 18L18 6" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Role Selection */}
                <h2 className="text-center text-xl font-semibold mt-2 mb-6">Select Your Role</h2>
                <div className="flex flex-col gap-5">
                    {ROLES.map(role => (
                        <button className={`border ${role.color} rounded-lg w-full px-4 py-5 flex flex-col items-center hover:shadow-md hover:scale-[1.02] transition`}
                            key={role.key}
                            onClick={() => {
                                onClose();
                                navigate(role.path);
                            }}
                        >
                            <span className={`rounded-full ${role.iconBg} p-3 mb-1 flex items-center justify-center`}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 3L4 6V11C4 16.25 12 21 12 21C12 21 20 16.25 20 11V6L12 3Z" stroke={role.iconStroke} strokeWidth="2" strokeLinejoin="round" fill="white" />
                                </svg>
                            </span>

                            <span className="font-semibold text-gray-900 text-lg">{role.name}</span>
                            <span className="text-xs text-gray-500">{role.desc}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default LoginModal;