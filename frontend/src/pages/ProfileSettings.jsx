import React, { useState } from "react";

export default function ProfileSettings() {
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    //Connect backend here to update the profile
    alert("Profile updated");
  };

  return (
    <div className="p-12">
      <h2 className="font-bold text-3xl text-gray-900 mb-2">Profile Settings</h2>
      <p className="text-gray-500 mb-8 text-lg">Update your account information</p>

      <div className="bg-white max-w-xl rounded-xl shadow p-8">
        <div className="flex items-center font-bold text-xl text-gray-900  mb-4">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth={2} />
            <path stroke="currentColor" strokeWidth={2} strokeLinecap="round" d="M6 20c0-3.31 2.69-6 6-6s6 2.69 6 6" />
          </svg>
          Account Information
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700 font-semibold mb-1 block">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Divine Smith" required className="border boder-gray-300 rounded px-4 py-2 w-full" />
            </div>
            <div>
              <label className="text-gray-700 font-semibold mb-1 block">Organization</label>
              <input type="text" value={organization} onChange={e => setOrganization(e.target.value)} placeholder="NNPC" required className="border border-gray-300 rounded px-4 py-2 w-full" />
            </div>
          </div>

          <div>
            <label className="text-gray-700 font-semibold mb-1 block">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nnpc@gmail.com" required className="border border-gray-300 rounded px-4 py-2 w-full" />
          </div>

          <div>
            <label className="text-gray-700 font-semibold mb-1 block">New Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter new password" required className="border border-gray-300 rounded px-4 py-2 w-full" />
          </div>

          <button type="submit" className="bg-green-800 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded text-lg">Update Profile</button>
        </form>
      </div>
    </div>
  );
};