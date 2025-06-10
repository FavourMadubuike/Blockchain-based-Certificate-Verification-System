import React, { useState } from "react";

export default function CtaSection() {
    return (
        <section className="relative bg-gradient-to-tr from-green-600 to-green-500 py-20">
            {/* Decorative circles */}
            <div className="absolute top-8 left-8 w-32 h-32 rounded-full pulse-yellow-fill z-0"></div>
            <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full pulse-gray-fill z-0"></div>
            {/* COntext */}
            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
                <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-2">
                    Ready to Secure Your
                    <br />
                    <span className="text-yellow-300">FUTO Certificates?</span>
                </h2>
                <p className="text-lg text-center text-white/90 max-w-2xl mb-8 mt-2">Join FUTO's secure blockchain verification system to protect and verify academic credentials with unmatched security.</p>
                <button className="bg-white text-green-700 font-semibold px-8 py-3 rounded shadow hover:bg-green-50 transition mb-9">Get Started <span className="ml-2">&rarr;</span></button>  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                    <div className="bg-white/10 border border-white/20 rounded-xl p-6 flex flex-col items-center text-center">
                        <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="mb-2 text-yellow-300">
                            <circle cx="12" cy="12" r="10" stroke="#FFD600" strokeWidth="2" fill="none" />
                            <path d="M8 12l2 2 4-4" stroke="#FFD600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="font-bold text-white text-lg">University-Grade Security</p>
                        <p className="text-white/90 text-sm">Military-level encryption</p>
                    </div>
                    <div className="bg-white/10 border border-white/20 rounded-xl p-6 flex flex-col items-center text-center">
                        <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="mb-2 text-yellow-300">
                            <path d="M13 3a1 1 0 0 0-2 0v8a1 1 0 0 0 2 0V3z" fill="#FFD600" />
                            <path d="M12 21c4.418 0 8-3.582 8-8h-2a6 6 0 1 1-12 0H4c0 4.418 3.582 8 8 8z" fill="#FFD600" />
                        </svg>
                        <p className="font-bold text-white text-lg">Lightning Fast</p>
                        <p className="text-white/90 text-sm">Verify in under 3 seconds</p>
                    </div>
                </div>
            </div>
        </section>
    );
}