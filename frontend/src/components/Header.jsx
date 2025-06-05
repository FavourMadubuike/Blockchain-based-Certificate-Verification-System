import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import futoLogo from '../assets/futo-logo.png';
import StudentLoginForm from './StudentLoginForm';
import SenateLoginForm from './SenateLoginForm';
import VerifierLoginForm from './VerifierLoginForm';

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [tempRole, setTempRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleLoginClick = () => {
    setShowModal(true);
    setTempRole(null);
    setSelectedRole(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTempRole(null);
    setSelectedRole(null);
  };

  const handleLoginSuccess = () => {
    setShowModal(false);
    setTempRole(null);
    setSelectedRole(null);
  };

  const handleNextClick = () => {
    if (tempRole) {
      setSelectedRole(tempRole);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-100 px-8 py-5 flex items-center justify-between sticky top-0 z-50 border-none">
      {/* Logo Section */}
      <Link to="/" className="flex items-center space-x-3">
        <img src={futoLogo} alt="FUTO Logo" className="h-14 w-14 object-contain transition-transform duration-300 hover:scale-105" />
        <span className="text-green-900 text-2xl font-bold hidden md:block">FUTO</span>
      </Link>

      {/* Navigation Links */}
      <ul className="flex items-center space-x-10">
        <li>
          <Link
            to="/"
            className="text-green-900 text-lg font-semibold hover:text-green-600 transition-colors duration-300"
          >
            Home
          </Link>
        </li>
        <li>
          <button
            className="bg-green-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-green-700 hover:shadow-lg transition-all duration-300"
          >
            Connect Wallet
          </button>
        </li>
        <li>
          <button
            className="bg-green-50 border-2 border-green-600 text-green-600 px-6 py-2.5 rounded-full font-medium hover:bg-green-600 hover:text-white hover:shadow-lg transition-all duration-300"
            onClick={handleLoginClick}
          >
            Login
          </button>

          {/* Modal */}
          {showModal && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300"
              onClick={handleCloseModal}
            >
              <div
                className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md transform transition-opacity duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()}
              >
                {!selectedRole ? (
                  <>
                    {/* Modal Header */}
                    <div className="flex items-center justify-between border-b border-green-200 pb-4 mb-4">
                      <h3 className="text-xl font-semibold text-green-900">
                        Select Your Role
                      </h3>
                      <button
                        className="text-green-600 bg-transparent hover:bg-green-100 hover:text-green-800 rounded-lg h-8 w-8 flex items-center justify-center transition-colors duration-200"
                        onClick={handleCloseModal}
                      >
                        <svg
                          className="w-4 h-4"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                    </div>

                    {/* Modal Body */}
                    <div className="space-y-4">
                      <p className="text-green-600 text-sm font-medium">
                        Choose your login role:
                      </p>
                      <ul className="space-y-3">
                        <li>
                          <input
                            type="radio"
                            id="role-student"
                            name="role"
                            value="Student"
                            className="hidden peer"
                            onChange={() => setTempRole('Student')}
                          />
                          <label
                            htmlFor="role-student"
                            className="flex items-center justify-between w-full p-4 bg-white border border-green-300 rounded-lg cursor-pointer text-green-900 hover:bg-green-50 hover:text-green-700 peer-checked:border-green-600 peer-checked:text-green-600 transition-colors duration-200"
                          >
                            <div className="block">
                              <div className="text-lg font-semibold">Student</div>
                              <div className="text-sm text-green-500">Access student portal</div>
                            </div>
                            <svg
                              className="w-4 h-4 text-green-500"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 10"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                              />
                            </svg>
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            id="role-senate"
                            name="role"
                            value="Senate"
                            className="hidden peer"
                            onChange={() => setTempRole('Senate')}
                          />
                          <label
                            htmlFor="role-senate"
                            className="flex items-center justify-between w-full p-4 bg-white border border-green-300 rounded-lg cursor-pointer text-green-900 hover:bg-green-50 hover:text-green-700 peer-checked:border-green-600 peer-checked:text-green-600 transition-colors duration-200"
                          >
                            <div className="block">
                              <div className="text-lg font-semibold">Senate</div>
                              <div className="text-sm text-green-500">Manage academic records</div>
                            </div>
                            <svg
                              className="w-4 h-4 text-green-500"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 10"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                              />
                            </svg>
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            id="role-verifier"
                            name="role"
                            value="Verifier"
                            className="hidden peer"
                            onChange={() => setTempRole('Verifier')}
                          />
                          <label
                            htmlFor="role-verifier"
                            className="flex items-center justify-between w-full p-4 bg-white border border-green-300 rounded-lg cursor-pointer text-green-900 hover:bg-green-50 hover:text-green-700 peer-checked:border-green-600 peer-checked:text-green-600 transition-colors duration-200"
                          >
                            <div className="block">
                              <div className="text-lg font-semibold">Verifier</div>
                              <div className="text-sm text-green-500">Verify credentials</div>
                            </div>
                            <svg
                              className="w-4 h-4 text-green-500"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 10"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                              />
                            </svg>
                          </label>
                        </li>
                      </ul>
                      <button
                        className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 hover:shadow-lg transition-all duration-300 disabled:bg-green-300 disabled:cursor-not-allowed"
                        onClick={handleNextClick}
                        disabled={!tempRole}
                      >
                        Next
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {selectedRole === 'Student' && (
                      <StudentLoginForm
                        onLogin={handleLoginSuccess}
                        onCancel={handleCloseModal}
                      />
                    )}
                    {selectedRole === 'Senate' && (
                      <SenateLoginForm
                        onLogin={handleLoginSuccess}
                        onCancel={handleCloseModal}
                      />
                    )}
                    {selectedRole === 'Verifier' && (
                      <VerifierLoginForm
                        onLogin={handleLoginSuccess}
                        onCancel={handleCloseModal}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Header;