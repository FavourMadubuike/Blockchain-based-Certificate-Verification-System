import React, { useEffect } from 'react';

const VerifierLoginForm = ({ onLogin, onCancel }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Verifier login successful with email and password!');
    onLogin();
  };

  const handleGoogleLogin = (credentialResponse) => {
    alert('Google login successful! Credential: ' + JSON.stringify(credentialResponse));
    onLogin();
  };

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with actual client ID
        callback: handleGoogleLogin,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between border-b border-green-200 pb-4 mb-4">
        <h3 className="text-xl font-semibold text-green-900">Verifier Login</h3>
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
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-green-900">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="bg-green-50 border border-green-300 text-green-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 placeholder-green-500"
            placeholder="name@company.com"
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
        <div className="flex justify-between">
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
          <a href="#" className="text-sm text-green-600 hover:underline">
            Lost Password?
          </a>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-300"
        >
          Login to your account
        </button>
        <div className="relative flex items-center justify-center my-4">
          <span className="absolute bg-white px-2 text-sm text-green-600">or</span>
          <hr className="w-full border-green-200" />
        </div>
        <div id="google-signin-button" className="w-full"></div>
        <div className="text-sm font-medium text-green-600">
          Not registered?{' '}
          <a href="#" className="text-green-700 hover:underline">
            Create account
          </a>
        </div>
      </form>
    </div>
  );
};

export default VerifierLoginForm;