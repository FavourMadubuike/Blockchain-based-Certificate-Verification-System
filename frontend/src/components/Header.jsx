import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import futoLogo from '../assets/futo-logo.png';
import StudentLoginForm from './Student-LoginForm';
import SenateLoginForm from './Senate-LoginForm';
import VerifierLoginForm from './Verifier-LoginForm';

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [SelectedRole, setSelectedRole] = useState(null);

  //Modal open/close handlers
  const handleLoginClick = () => {
    setShowModal(true);
    setSelectedRole(null);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole(null);
  };

  //When a role is selected, (Student/Senate/Verifier)
  const handleRoleClick = (role) => {
    setSelectedRole(role);
  };
  const handleLoginSuccess = () => {
    setShowModal(false);
    setSelectedRole(null);
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-white px-8 py-4 shadow-md flex items-center justify-between">

      {/* Logo Section */}
        <Link to = "/"><img src={futoLogo} alt="FUTO Logo" className="h-10 w-10 object-contain" /></Link>
      
      
      {/* Navigation Links */}
      <ul className="flex items-center space-x-12">
        <li><Link to ="/" className="text-green-900 hover:text-green-600 font-medium">Home</Link> </li>
        <li><button className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded transition">Connect Wallet</button></li>
        <li><button className="bg-white border border-green-700 text-green-700 px-4 py-2 rounded hover:bg-green-700 hover:text-white transition" onClick={handleLoginClick}>Login</button>
          
          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={handleCloseModal}>
              <div className="bg-white p-6 rounded-lg shadow-lg min-w-[350px]" onClick={e => e.stopPropagation()}>
                {!SelectedRole && (
                  <>
                    <h2 className="text-lg mb-4">Login as:</h2>                   
                    <div className="flex flex-col gap-2 mb-2">
                      <button className="bg-green-700 text-white py-2 rounded" onClick={() => handleRoleClick('Student')}>Student</button>
                      <button className="bg-green-700 text-white py-2 rounded" onClick={() => handleRoleClick('Senate')}>Senate</button>
                      <button className="bg-green-700 text-white py-2 rounded" onClick={() => handleRoleClick('Verifier')}>Verifier</button>
                    </div>
                    <button className="text-red-600 hover:underline mt-2" onClick={handleCloseModal}>Close</button>
                  </>
                )}

                {SelectedRole === 'Student' && (
                  <StudentLoginForm onLogin = {handleLoginSuccess} onCancel = {handleCloseModal} />
                )}

                {SelectedRole === 'Senate' && (
                  <SenateLoginForm onLogin = {handleLoginSuccess} onCancel={handleCloseModal} />
                )}

                {SelectedRole === 'Verifier' && (
                  <VerifierLoginForm onLogin= {handleLoginSuccess} onCancel={handleCloseModal} />
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