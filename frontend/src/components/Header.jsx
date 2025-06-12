import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import futoLogo from "../assets/futo-logo.png";
import LoginModal from "./LoginModal";
import { ConnectButton } from "@rainbow-me/rainbowkit";


const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);


<<<<<<< HEAD
  const howItWorksRef = useRef(null);

  return (
    <>
      <header className="w-full bg-white shadow-sm">
=======
  const scrollToHowItWorks = () => {
    const section = document.getElementById("how-it-works");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
>>>>>>> origin/master
        <nav className="container mx-auto flex items-center justify-between px-3 sm:px-4 py-3">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center text-gray-900">
            <img src={futoLogo} alt="FUTO Logo" className="h-10 w-10 object-contain" />
            <span className="ml-2 font-bold text-lg sm:text-xl">FUTO CertVerify</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button className="text-gray-700 font-medium hover:text-green-700 transition" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}> Home</button>

<<<<<<< HEAD
            <button className="text-gray-700 font-medium hover:text-green-700 transition">How It Works</button>

            <ConnectButton />

            <button className="bg-green-600 rounded-md px-6 py-2 text-white font-semibold hover:bg-green-700 transition"
              onClick={() => setShowLogin(true)}
            >Login</button>
=======
            <button className="text-gray-700 font-medium hover:text-green-700 transition" onClick={scrollToHowItWorks}>How It Works</button>

            <ConnectButton />

            <button className="bg-green-600 rounded-md px-6 py-2 text-white font-semibold hover:bg-green-700 transition" onClick={() => setShowLogin(true)}>Login</button>
>>>>>>> origin/master
          </div>

          {/* Hamburger icon */}
          <button className="md:hidden p-2 group" onClick={() => setMobileOpen((open) => !open)} aria-label="open menu">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" className="stroke-current text-slate-900 group-hover:text-green-600 transition-colors" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white shadow px-4 pb-4 pt-2 z-50">
            <button className="block w-full text-left py-2 text-gray-700 font-medium hover:text-green-600 transition"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setMobileOpen(false);
              }}
            >Home</button>

            <button className="block w-full text-left py-2 text-gray-700 font-medium hover:text-green-600 transition"
              onClick={() => setMobileOpen(false)}
            >How It Works</button>

            <div className="mt-2 mb-2">
              <ConnectButton />
            </div>

            <button className="bg-green-600 rounded-md px-6 py-2 mt-2 text-white font-semibold hover:bg-green-700 transition w-full"
              onClick={() => { setShowLogin(true); setMobileOpen(false) }}
            >Login</button>
          </div>
        )}
      </header>

      {/* Show the modal */}
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>

  );
};
export default Header;