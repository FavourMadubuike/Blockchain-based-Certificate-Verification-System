import React, { useState } from "react";

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="bg-white py-16 mb-4">
            <div className="container mx-auto px-4">
                <h2 className="text-gray-900 font-bold text-4xl md:text-5xl text-center mb-4">How It Works</h2>
                <p className="text-gray-700 text-lg text-center max-w-2xl mx-auto mb-12">FUTO's streamlined blockchain verification process for academic credentials in four simple steps.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 max-w-6xl mx-auto">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center">
                        <div className="bg-green-600 rounded-xl shadow-lg p-6 mb-4 transition-transform transition-shadow duration-300 hover:scale-105">
                            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="#FFF" strokeWidth="2" />
                                <path d="M7 10l5 5 5-5" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 15V3" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>

                        <div className="bg-gray-50 rounded-xl shadow-lg p-6 w-full text-center transition-transform transition-shadow duration-300 hover:shadow-xl">
                            <h3 className="text-sm text-gray-700 font-bold mb-1">STEP 1</h3>
                            <p className="text-xl text-gray-900 font-extrabold mb-2">Senate Upload</p>
                            <p className="text-gray-600 text-base">FUTO Senate uploads student academic records and statements of results to the blockchain system.</p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center">
                        <div className="bg-green-700 rounded-xl shadow-lg p-6 mb-4 transition-transform transition-shadow duration-300 hover:scale-105">
                            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                                <rect x="4" y="4" width="16" height="16" rx="4" stroke="#FFF" strokeWidth="2" />
                                <text x="12" y="18" textAnchor="middle" fill="#FFF" fontSize="20" fontFamily="Arial">#</text> 
                            </svg>
                        </div>

                        <div className="bg-gray-50 rounded-xl shadow-lg p-6 w-full text-center transition-transform transition-shadow duration-300 hover:shadow-xl">
                            <h3 className="text-sm text-gray-700 font-bold mb-1">STEP 2</h3>
                            <p className="text-xl text-gray-900 font-extrabold mb-2">Student Access</p>
                            <p className="text-gray-600 text-base">Students login with their JAMB registration number to view and download their verified certificates.</p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center">
                        <div className="bg-teal-600 rounded-xl shadow-lg p-6 mb-4 transition-transform transition-shadow duration-300 hover:scale-105">
                            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                                <path d="M12 3l7 4v5c0 5.25-3.75 10-7 10s-7-4.75-7-10V7l7-4z" stroke="#FFF" strokeWidth="2" />
                            </svg>
                        </div>

                        <div className="bg-gray-50 rounded-xl shadow-lg p-6 w-full text-center transition-transform transition-shadow duration-300 hover:shadow-xl">
                            <h3 className="text-sm text-gray-700 font-bold mb-1">STEP 3</h3>
                            <p className="text-xl text-gray-900 font-extrabold mb-2">Blockchain Storage</p>
                            <p className="text-gray-600 text-base">All certificates are securely stored on blockchain with unique IDs for tamper-proof verification.</p>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center">
                        <div className="bg-green-700 rounded-xl shadow-lg p-6 mb-4 transition-transform transition-shadow duration-300 hover:scale-105">
                            <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" fill="#22c55e" />
                                <path d="M8 12l2 2 4-4" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <div className="bg-gray-50 rounded-xl shadow-lg p-6 w-full text-center transition-transform transition-shadow duration-300 hover:shadow-xl">
                            <h3 className="text-sm text-gray-700 font-bold mb-1">STEP 4</h3>
                            <p className="text-xl text-gray-900 font-extrabold mb-2">Employer Verification</p>
                            <p className="text-gray-600 text-base">Employers and institutions verify certificates instantly using student details or unique blockchain IDs.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}