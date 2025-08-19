import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifierLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-green-50 min-h-screen flex relative">
      {/* Mobile hamburger */}
      <button className="md:hidden fixed top-4 left-4 z-20 bg-white p-2 rounded-full shadow" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke="currentColor" strokeWidth={2} strokeLinecap="round" d="M4 8h16M4 16h16" />
        </svg>
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-10 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div className={`w-64 bg-white py-8 px-4 rounded-r-2xl shadow flex flex-col transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 fixed md:static top-0 left-0 z-20 `}>

        {/* Close button for mobile */}
        <button className="md:hidden absolute top-4 right-4" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke="currentColor" strokeWidth={2} strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Sidebar Content */}
        <div className="flex items-center my-8">
          <svg className="w-7 h-7 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4v5c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V7l8-4z" />
          </svg>
          <div>
            <h1 className="font-bold text-lg text-gray-900">FUTO Verifier Dashboard</h1>
            <p className="text-gray-400 text-sm">Certificate Verification System</p>
          </div>
        </div>
        <nav className="flex-1">
          <button className={`flex items-center w-full font-semibold py-2 px-3 mb-4 rounded-lg
           ${location.pathname === "/verifier-dashboard"
              ? "bg-green-800 text-gray-100"
              : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => {
              navigate("/verifier-dashboard");
              setSidebarOpen(false);
            }}>
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={2} />
              <path stroke="currentColor" strokeWidth={2} strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            Verify Certificate
          </button>

          <button className={`flex items-center w-full font-semibold py-2 px-3 mb-4 rounded-lg
            ${location.pathname === "/profile-settings"
              ? "bg-green-800 text-gray-100"
              : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => {
              navigate("/profile-settings");
              setSidebarOpen(false);
            }}>
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth={2} />
              <path stroke="currentColor" strokeWidth={2} strokeLinecap="round" d="M6 20c0-3.31 2.69-6 6-6s6 2.69 6 6" />
            </svg>
            Profile Settings
          </button>

          <button type="button" className="flex items-center w-full text-red-600 hover:bg-red-50 rounded-lg py-2 px-3 mt-auto"
            onClick={() => {
              navigate("/");
              setSidebarOpen(false);
            }}>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
              <path stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 0118 0" />
            </svg>
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content: Certificate $ Profile */}
      <div className="flex-1 md:ml-6">{children}</div>
    </div>
  );
}