import React, { useState } from "react";
import { Link } from "react-router-dom";
import futoLogo from "../assets/futo-logo.png";

export default function Footer() {
    return (
        <footer className="bg-[#121926] pt-12 pb-4 px-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12">
                <div className="flex-1 min-w-[250px]">
                    {/* Logo and Title */}
                    <Link to="/" className="flex items-center gap-2 mb-2">
                        <img src={futoLogo} alt="FUTO Logo" className="h-10 w-10 object-contain" />
                        <span className="font-extrabold text-2xl text-white">FUTO CertVerify</span>
                    </Link>
                    <p className="text-gray-400 mb-3 max-w-md">Federal University of Technology Owerri’s secure blockchain certificate verification system. Protecting academic credentials and building trust in education.</p>
                    <div className="text-gray-400 flex items-center gap-2 mb-1">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                            <path d="M4 4h16v16H4z" fill="none" />
                            <path d="M4 4l16 16M20 4L4 20" stroke="#e5e7eb" strokeWidth="1.5" />
                            <path d="M4 4l16 16" stroke="#e5e7eb" strokeWidth="1.5" />
                            <path d="M21 6.5v11a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 17.5v-11A2.5 2.5 0 015.5 4h13A2.5 2.5 0 0121 6.5zm-2 0A.5.5 0 0018.5 6h-13a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h13a.5.5 0 00.5-.5v-11z" fill="#e5e7eb" />
                        </svg>
                        <span>support@futo.edu.ng</span>
                    </div>
                    <div className="text-gray-400 flex items-center md:items-start gap-2">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                            <path d="M12 2C7 2 3 6 3 11c0 5.25 5.25 9.75 8.25 11.62a1 1 0 0 0 1.5 0C15.75 20.75 21 16.25 21 11c0-5-4-9-9-9zm0 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" stroke="#e5e7eb" strokeWidth="1.5" />
                        </svg>
                        <span>PMB 1526, Owerri, Imo State, Nigeria</span>
                    </div>
                </div>

                {/* Center: Quick Links */}
                <div className="flex-1 min-w-[200px] md:pl-8">
                    <h3 className="text-white font-bold mb-3">Quick Access</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:underline">Verify Certificate</a></li>
                        <li><a href="#" className="hover:underline">Student Portal</a></li>
                        <li><a href="#" className="hover:underline">Verifier Portal</a></li>
                        <li><a href="#" className="hover:underline">Senate Portal</a></li>
                    </ul>
                </div>

                {/* Right: Support Links */}
                <div className="flex-1 min-w-[200px] md:pl-8">
                    <h3 className="text-white font-bold mb-3">Support</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:underline">Help Center</a></li>
                        <li><a href="#" className="hover:underline">Contact Support</a></li>
                        <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                        <li><a href="#" className="hover:underline">Terms of Service</a></li>
                    </ul>
                </div>
            </div>

            <hr className="border-gray-700 my-8" />
            <p className="text-gray-400 text-center text-sm">© 2025 Federal University of Technology Owerri. All rights reserved. Powered by blockchain technology.</p>
        </footer>
    );
}