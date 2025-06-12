import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import LoginModal from "./LoginModal";
import HowItWorks from "./HowItWorks";
import CtaSection from "./CtaSection";
import Footer from "./Footer";

export default function Home() {
    return (
        <div className="min-h-[calc(100vh-80px)] pt-16 bg-green-50">
            <div className="container mx-auto flex flex-col-reverse lg:flex-row items-start justify-center gap-12 px-6 py-12 lg:mt-32">
                {/* Card Image */}
                <div className="relative w-full max-w-[650px] flex-shrink-0 flex justify-center lg:justify-start" >
                    {/* White Card */}
                    <div className="relative w-full h-[250px] bg-white rounded-2xl shadow-2xl rotate-[4deg]">
                        {/* Green Gradient Inner Card */}
                        <div className="bg-gradient-to-tr from-green-700 to-green-600 absolute top-6 left-6 right-6 bottom-6 rounded-xl p-6 flex flex-col justify-between">
                            {/* Top Row */}
                            <div className="flex justify-between items-start mb-4">
                                {/* Shield Icon / Verified */}
                                <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
                                    <path d="M16 5L7 9v5c0 7.18 6.55 11.72 8.5 12.87a1 1 0 0 0 1 0C18.45 25.72 25 21.18 25 14V9l-9-4z" stroke="#fff" strokeWidth="2" />
                                </svg>
                                <span className="text-white text-sm font-medium opacity-80">Verified</span>
                            </div>

                            {/* Middle Text */}
                            <div>
                                <div className="text-white text-xl font-bold mb-1">FUTO Certificate</div>
                                <div className="text-white text-base opacity-90 mb-4">Bachelor of Technology</div>
                            </div>

                            {/* Blockchain ID Box */}
                            <div className="mt-2">
                                <div className="rounded-md px-4 py-2 bg-white/10 text-white/90 text-sm font-mono">
                                    <span className="font-normal text-white/80">Blockchain ID:</span>
                                    <span className="font-semibold">0x1a2b3c...def456</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating checkmark */}
                    <div className="absolute -top-3 -right-[20px]  z-10">
                        <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-4 border-white">
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="12" fill="#22c55e" />
                                <path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Text Section */}
                <div className="w-full max-w-[600px] items-start text-left -mt-6 ">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight text-center lg:text-left">Secure Your <br /> <span className="text-green-600">Accademic Future</span></h1>
                    <p className="text-lg mt-4 text-gray-700 text-center lg:text-left max-w-">Federal University of Technology Owerri's revolutionary blockchain certificate verification system. Protect your credentials, build trust, and verify authenticity instantly.</p>
                    <div className="mt-8 flex sm:flex-row gap-4 w-full justify-center lg:justify-start">
                        <ConnectButton />
                        <button className="border border-green-600 text-green-600 bg-white font-semibold px-8 rounded hover:bg-green-50 transition">Verify Certificate</button>
                    </div>
                    {/* Statics */}
                    <div className="border-t border-green-200 w-full mt-10 grid grid-cols-3 sm:grid-cols-3 gap-6 pt-8 text-center lg:text-left">
                        <div>
                            <p className="text-2xl font-bold text-green-700">10K+</p>
                            <p className="text-gray-600">Certificates Issued</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-700">99.9%</p>
                            <p className="text-gray-600">Security Rate</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-700">500K+</p>
                            <p className="text-gray-600">Verified Employers</p>
                        </div>
                    </div>
                </div>
            </div>
            <HowItWorks />
            <CtaSection/>
            <Footer/>
        </div>
    );
}