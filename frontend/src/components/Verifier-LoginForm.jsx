import React, {useState} from 'react';

const VerifierLoginForm = ({ onLogin, onCancel }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Verifier login successful with email and password!');
        onLogin();
    };

    const handleGoogleLogin = () => {
        alert('Verifier login with Google! (You can implement real Google login here.)');
        onLogin();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input className="border border-green-500 focus:outline-none focus:ring-0 focus:border-green-700 rounded px-3 py-2" type="email" name="email" placeholder="Email" required />
            <input className="border border-green-500 focus:outline-none focus:ring-0 focus:border-green-700 rounded px-3 py-2" type="password" name="password" placeholder="Password" required />
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition" type="submit">Login</button>
            <div className="flex items-center justify-center">
                <hr className="flex-grow border-t border-gray-400" />
                <span className="mx-2 text-gray-700 text-sm">or Login With</span>
                <hr className="flex-grow border-t border-gray-400" />
            </div>
            <button className="bg-white border border-green-700 text-green-700 px-4 py-2 rounded hover:bg-green-700 hover:text-white transition" type="button" onClick={handleGoogleLogin}>Login with Google</button>
            <button className="bg-red-500 text-white px-0 py-1 rounded hover:bg-red-600" type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};
export default VerifierLoginForm;