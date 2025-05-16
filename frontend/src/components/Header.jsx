import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-gradient-to-r from-green-600 to-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img
                className="h-10 w-auto"
                src="/futo-logo.png"
                alt="FUTO Logo"
              />
            </Link>
            <span className="ml-3 text-xl font-bold text-green-800">
              FUTO Certificate System
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-green-800 hover:text-green-600 font-medium"
            >
              Home
            </Link>

            {/* Role Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="text-green-800 hover:text-green-600 font-medium flex items-center"
              >
                Roles
                <svg
                  className="ml-1 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/issuer/login"
                    className="block px-4 py-2 text-sm text-green-800 hover:bg-green-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Issuer
                  </Link>
                  <Link
                    to="/recipient/login"
                    className="block px-4 py-2 text-sm text-green-800 hover:bg-green-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Recipient
                  </Link>
                  <Link
                    to="/verifier/login"
                    className="block px-4 py-2 text-sm text-green-800 hover:bg-green-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Verifier
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/login"
              className="text-green-800 hover:text-green-600 font-medium"
            >
              Login
            </Link>
            <Link
              to="/verifier/signup"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Sign Up (Verifier)
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;