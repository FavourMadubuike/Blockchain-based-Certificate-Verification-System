import React from 'react';

const StudentLoginForm = ({ onLogin, onCancel }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Student login successful! (Redirect to dashboard)');
    onLogin();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between border-b border-green-200 pb-4 mb-4">
        <h3 className="text-xl font-semibold text-green-900">Student Login</h3>
        <button
          className="text-green-600 bg-transparent hover:bg-green-100 hover:text-green-800 rounded-lg h-8 w-8 flex items-center justify-center transition-colors duration-200"
          onClick={onCancel}
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
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-green-900">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="bg-green-50 border border-green-300 text-green-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 placeholder-green-500"
            placeholder="Enter JAMB Reg No"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-green-900">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="bg-green-50 border border-green-300 text-green-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 placeholder-green-500"
            placeholder="••••••••"
            required
          />
        </div>
        <div className="flex justify-start">
          <div className="flex items-start">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 border border-green-300 rounded-sm bg-green-50 focus:ring-3 focus:ring-green-300"
            />
            <label htmlFor="remember" className="ms-2 text-sm font-medium text-green-900">
              Remember me
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-300"
        >
          Login to your account
        </button>
      </form>
    </div>
  );
};

export default StudentLoginForm;